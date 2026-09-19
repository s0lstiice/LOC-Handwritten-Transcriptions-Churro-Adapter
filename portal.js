(() => {
  'use strict';

  const $ = selector => document.querySelector(selector);
  const BATCH_SIZE = 200;
  const state = {
    all: [],
    filtered: [],
    current: null,
    position: 0,
    zoom: 1,
    request: 0,
    filterRun: 0,
    searchTimer: null,
    searchTexts: null,
    searchPromise: null,
    renderLimit: BATCH_SIZE,
  };
  const repositoryBase = new URL('./', location.href);
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[character]));
  const normalize = value => String(value ?? '').normalize('NFKD').toLocaleLowerCase();

  async function loadManifest() {
    const response = await fetch('LOC_TRANSCRIPTION_METADATA/manifest.jsonl');
    if (!response.ok) throw new Error(`Metadata request failed (${response.status})`);
    const body = await response.text();
    state.all = body.trim().split(/\r?\n/).filter(Boolean).map((line, index) => ({
      ...JSON.parse(line),
      _index: index,
    }));
    const collections = [...new Set(state.all.map(row => row.collection))].sort();
    for (const name of collections) $('#collection').add(new Option(name, name));
    updateItemOptions();
    await applyFilters(false);
    const requested = new URLSearchParams(location.search).get('page');
    if (requested) {
      const index = state.filtered.findIndex(row => row.page_id === requested);
      if (index >= 0) state.position = index;
    }
    renderPageList();
    await show(state.position);
  }

  async function ensureSearchIndex() {
    if (state.searchTexts) return state.searchTexts;
    if (!state.searchPromise) {
      $('#count').textContent = 'Loading full-text index…';
      state.searchPromise = fetch('LOC_TRANSCRIPTION_METADATA/search_index.json')
        .then(response => {
          if (!response.ok) throw new Error(`Search index request failed (${response.status})`);
          return response.json();
        })
        .then(texts => {
          if (!Array.isArray(texts) || texts.length !== state.all.length) {
            throw new Error('Search index does not match the page manifest');
          }
          state.searchTexts = texts;
          return texts;
        })
        .catch(error => {
          state.searchPromise = null;
          throw error;
        });
    }
    return state.searchPromise;
  }

  function updateItemOptions() {
    const select = $('#item');
    const previous = select.value;
    const collection = $('#collection').value;
    const items = new Map();
    for (const row of state.all) {
      if (collection && row.collection !== collection) continue;
      if (!items.has(row.item_id)) items.set(row.item_id, row.title || row.item_id);
    }
    select.replaceChildren(new Option('All items', ''));
    for (const [itemId, title] of [...items].sort((a, b) => a[0].localeCompare(b[0]))) {
      select.add(new Option(`${itemId} · ${title}`, itemId));
    }
    if ([...select.options].some(option => option.value === previous)) select.value = previous;
  }

  function metadataText(row) {
    return normalize([row.page_id, row.item_id, row.page_number, row.title, row.collection].join('\n'));
  }

  async function applyFilters(render = true) {
    const run = ++state.filterRun;
    const collection = $('#collection').value;
    const item = $('#item').value;
    const rawQuery = $('#search').value.trim();
    const terms = normalize(rawQuery).split(/\s+/).filter(Boolean);
    if (terms.length) await ensureSearchIndex();
    if (run !== state.filterRun) return;

    const currentId = state.current?.row.page_id;
    state.filtered = state.all.filter(row => {
      if (collection && row.collection !== collection) return false;
      if (item && row.item_id !== item) return false;
      if (!terms.length) return true;
      const haystack = `${metadataText(row)}\n${normalize(state.searchTexts[row._index])}`;
      return terms.every(term => haystack.includes(term));
    });
    const retained = currentId ? state.filtered.findIndex(row => row.page_id === currentId) : -1;
    state.position = retained >= 0 ? retained : 0;
    state.renderLimit = BATCH_SIZE;
    $('#slider').max = Math.max(0, state.filtered.length - 1);
    renderPageList();
    if (render) await show(state.position);
  }

  function transcriptSnippet(row) {
    const query = normalize($('#search').value.trim()).split(/\s+/).filter(Boolean)[0];
    if (!query || !state.searchTexts) return '';
    const text = String(state.searchTexts[row._index] || '').replace(/\s+/g, ' ').trim();
    const location = normalize(text).indexOf(query);
    if (location < 0) return '';
    const start = Math.max(0, location - 55);
    const end = Math.min(text.length, location + query.length + 90);
    return `${start ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
  }

  function renderPageList() {
    const list = $('#pageList');
    const visible = state.filtered.slice(0, state.renderLimit);
    list.innerHTML = visible.map((row, position) => {
      const snippet = transcriptSnippet(row);
      return `<button class="page-entry${position === state.position ? ' active' : ''}" type="button" role="option" aria-selected="${position === state.position}" data-position="${position}">
        <strong>${escapeHtml(row.page_id)}</strong>
        <span>${escapeHtml(row.item_id)} · page ${escapeHtml(row.page_number)}</span>
        ${snippet ? `<span class="snippet">${escapeHtml(snippet)}</span>` : ''}
      </button>`;
    }).join('') + (visible.length < state.filtered.length
      ? `<div class="list-note">Scroll for more · showing ${visible.length.toLocaleString()} of ${state.filtered.length.toLocaleString()}</div>`
      : '');
    $('#browseCount').textContent = `${state.filtered.length.toLocaleString()} page${state.filtered.length === 1 ? '' : 's'}`;
  }

  function syncSelectedEntry() {
    for (const entry of document.querySelectorAll('.page-entry.active')) {
      entry.classList.remove('active');
      entry.setAttribute('aria-selected', 'false');
    }
    const selected = document.querySelector(`.page-entry[data-position="${state.position}"]`);
    if (selected) {
      selected.classList.add('active');
      selected.setAttribute('aria-selected', 'true');
      selected.scrollIntoView({ block: 'nearest' });
    }
  }

  async function show(position) {
    if (!state.filtered.length) return showEmpty();
    state.position = Math.max(0, Math.min(position, state.filtered.length - 1));
    if (state.position >= state.renderLimit) {
      state.renderLimit = Math.ceil((state.position + 1) / BATCH_SIZE) * BATCH_SIZE;
      renderPageList();
    } else {
      syncSelectedEntry();
    }
    const row = state.filtered[state.position];
    const request = ++state.request;
    let transcript = state.searchTexts?.[row._index];
    if (transcript == null) {
      const transcriptResponse = await fetch(row.transcript);
      transcript = transcriptResponse.ok ? await transcriptResponse.text() : '[Transcript file unavailable]';
    }
    if (request !== state.request) return;
    state.current = { row, transcript };
    $('#identity').textContent = `${row.page_id} · ${row.title}`;
    const matches = state.filtered.length === state.all.length ? '' : ` · ${state.filtered.length.toLocaleString()} matching`;
    $('#count').textContent = `${state.all.length.toLocaleString()} total pages${matches}`;
    $('#transcript').textContent = transcript || '[No visible transcription]';
    $('#characters').textContent = `${transcript.length.toLocaleString()} characters`;
    $('#position').textContent = `${(state.position + 1).toLocaleString()} of ${state.filtered.length.toLocaleString()}`;
    $('#slider').value = state.position;
    $('#previous').disabled = state.position === 0;
    $('#next').disabled = state.position === state.filtered.length - 1;
    history.replaceState(null, '', `${location.pathname}?page=${encodeURIComponent(row.page_id)}`);
    $('#details').innerHTML = [
      `<span>${escapeHtml(row.collection)} · Item ${escapeHtml(row.item_id)} · Page ${escapeHtml(row.page_number)}</span>`,
      '<span class="warning">Unreviewed OCR draft—not an official LOC transcription or verified ground truth.</span>',
      `<span><a href="${escapeHtml(row.loc_url)}" target="_blank" rel="noreferrer">Open page at the Library of Congress ↗</a> · <a href="${escapeHtml(row.item_url)}" target="_blank" rel="noreferrer">Open item record ↗</a> · <a href="${escapeHtml(row.image_url)}" target="_blank" rel="noreferrer">Open LOC image ↗</a></span>`,
    ].join('');
    const scan = $('#scan');
    scan.onerror = () => {
      if (scan.src !== row.image_url) scan.src = row.image_url;
    };
    scan.onload = fitImage;
    scan.src = new URL(row.image, repositoryBase).href;
    $('#download').onclick = () => {
      const anchor = document.createElement('a');
      anchor.href = row.transcript;
      anchor.download = `${row.page_id}.txt`;
      anchor.click();
    };
    syncSelectedEntry();
    $('#loading').style.display = 'none';
  }

  function showEmpty() {
    state.current = null;
    $('#identity').textContent = 'No pages match these filters';
    $('#count').textContent = `${state.all.length.toLocaleString()} total pages · 0 matching`;
    $('#scan').removeAttribute('src');
    $('#transcript').textContent = 'Try another collection, item, or search term.';
    $('#characters').textContent = '';
    $('#details').innerHTML = '';
    $('#position').textContent = '0 of 0';
    $('#browseCount').textContent = '0 pages';
    $('#loading').style.display = 'none';
  }

  function setZoom(value, isFit = false) {
    state.zoom = Math.max(.1, Math.min(4, value));
    $('#scan').style.width = `${$('#scan').naturalWidth * state.zoom}px`;
    $('#scan').style.height = 'auto';
    $('#zoomLabel').textContent = isFit ? 'Fit' : `${Math.round(state.zoom * 100)}%`;
  }

  function fitImage() {
    const image = $('#scan');
    const stage = $('#imageStage');
    if (!image.naturalWidth || !image.naturalHeight) return;
    setZoom(Math.min((stage.clientWidth - 36) / image.naturalWidth, (stage.clientHeight - 36) / image.naturalHeight), true);
  }

  $('#collection').addEventListener('change', () => {
    updateItemOptions();
    state.position = 0;
    applyFilters();
  });
  $('#item').addEventListener('change', () => {
    state.position = 0;
    applyFilters();
  });
  $('#search').addEventListener('input', () => {
    clearTimeout(state.searchTimer);
    state.searchTimer = setTimeout(() => {
      state.position = 0;
      applyFilters().catch(error => {
        $('#identity').textContent = `Search unavailable: ${error.message}`;
      });
    }, 260);
  });
  $('#pageList').addEventListener('click', event => {
    const entry = event.target.closest('.page-entry');
    if (entry) show(Number(entry.dataset.position));
  });
  $('#pageList').addEventListener('scroll', () => {
    const list = $('#pageList');
    if (list.scrollTop + list.clientHeight < list.scrollHeight - 180) return;
    if (state.renderLimit >= state.filtered.length) return;
    state.renderLimit += BATCH_SIZE;
    renderPageList();
  });
  $('#previous').addEventListener('click', () => show(state.position - 1));
  $('#next').addEventListener('click', () => show(state.position + 1));
  $('#slider').addEventListener('input', event => show(Number(event.target.value)));
  $('#zoomIn').addEventListener('click', () => setZoom(state.zoom * 1.2));
  $('#zoomOut').addEventListener('click', () => setZoom(state.zoom / 1.2));
  $('#fit').addEventListener('click', fitImage);
  $('#copy').addEventListener('click', async () => {
    if (!state.current) return;
    await navigator.clipboard.writeText(state.current.transcript);
    const button = $('#copy');
    button.textContent = 'Copied';
    setTimeout(() => button.textContent = 'Copy text', 900);
  });
  document.addEventListener('keydown', event => {
    if (event.target.matches('input, select')) return;
    if (event.key === 'ArrowLeft') show(state.position - 1);
    if (event.key === 'ArrowRight') show(state.position + 1);
  });
  window.addEventListener('resize', () => state.current && fitImage());

  loadManifest().catch(error => {
    $('#loading').textContent = `Unable to open comparison desk: ${error.message}`;
  });
})();
