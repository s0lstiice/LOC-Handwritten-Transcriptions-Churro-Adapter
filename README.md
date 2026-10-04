# Library of Congress handwritten transcription drafts

This repository contains **12,903 baseline page scans paired with machine-generated transcription drafts**, plus **134 contextualized Hamlin correction records**. The portal therefore exposes **13,037 records representing 12,945 unique page IDs**; 92 corrected Hamlin pages also occur in the baseline set. These files are OCR drafts, not official Library of Congress transcriptions or verified ground truth. Human review is required before quotation, publication, or use as supervised training labels.

## Side-by-side comparison portal

[Open the side-by-side comparison portal](https://s0lstiice.github.io/LOC-Handwritten-Transcriptions-Churro-Adapter/) to browse every scan beside its draft transcription. The portal includes a scrollable page browser, collection and item filters, full-text transcript search, keyboard navigation, image zoom, permanent page links, transcript copy/download, and links back to the Library of Congress source records.

The portal is implemented by [`index.html`](index.html) and [`portal.js`](portal.js), reads the shared metadata directly, and loads the 13,037-record transcript search index only when a search is requested. It prefers the scan stored in this repository and falls back to the Library of Congress IIIF image when necessary.

## Collections

- `LOC_ANNA_MARIA_BRODEAU_THORNTON_TRANSCRIPTIONS/`: 1,229 scan/transcript pairs.
- `LOC_CHARLES_HAMLIN_TRANSCRIPTIONS/`: 2,663 baseline scan/transcript pairs, with 134 contextualized correction pairs containing 424 correction occurrences under `CONTEXTUALIZED_CORRECTIONS/`.
- `LOC_MARGARET_BAYARD_SMITH_TRANSCRIPTIONS/`: 2,475 scan/transcript pairs.
- `LOC_SAMUEL_F_B_MORSE_TRANSCRIPTIONS/`: 6,536 scan/transcript pairs.
- `LOC_TRANSCRIPTION_METADATA/`: shared CSV and JSONL provenance for all 13,037 portal records.

Each collection stores a `.jpg` scan beside its matching `.txt` draft. The metadata provides the repository paths, checksums, and direct Library of Congress page, item, and IIIF image URLs.

The separate expanded Hamlin index-digest reread is intentionally excluded.
