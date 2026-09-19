# Library of Congress handwritten transcription drafts

This repository contains **6,477 original page scans paired with 6,477 machine-generated page transcription drafts** for handwritten Library of Congress material. These files are OCR drafts, not official Library of Congress transcriptions or verified ground truth. Human review is required before quotation, publication, or use as supervised training labels.

## Side-by-side comparison portal

[Open the side-by-side comparison portal](https://s0lstiice.github.io/LOC-Handwritten-Transcriptions-Churro-Adapter/) to browse every scan beside its draft transcription. The portal supports collection filtering, page/item/title search, keyboard navigation, image zoom, permanent page links, transcript copy/download, and links back to the Library of Congress source records.

The portal is implemented by [`index.html`](index.html) and reads the shared metadata directly. It prefers the scan stored in this repository and falls back to the Library of Congress IIIF image when necessary.

## Collections

- `LOC_ANNA_MARIA_BRODEAU_THORNTON_TRANSCRIPTIONS/`: 423 scan/transcript pairs.
- `LOC_CHARLES_HAMLIN_TRANSCRIPTIONS/`: 1,463 scan/transcript pairs.
- `LOC_MARGARET_BAYARD_SMITH_TRANSCRIPTIONS/`: 1,330 scan/transcript pairs.
- `LOC_SAMUEL_F_B_MORSE_TRANSCRIPTIONS/`: 3,261 scan/transcript pairs.
- `LOC_TRANSCRIPTION_METADATA/`: shared CSV and JSONL provenance for all 6,477 drafts.

Each collection stores a `.jpg` scan beside its matching `.txt` draft. The metadata provides the repository paths, checksums, and direct Library of Congress page, item, and IIIF image URLs.

The separate expanded Hamlin index-digest reread is intentionally excluded.
