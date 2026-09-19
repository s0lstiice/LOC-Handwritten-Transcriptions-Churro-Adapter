# Library of Congress handwritten transcription drafts

This repository contains machine-generated transcription drafts for handwritten Library of Congress material. These files are OCR drafts, not official Library of Congress transcriptions or verified ground truth. Human review is required before quotation, publication, or use as supervised training labels.

## Packages

- `LOC_CHARLES_HAMLIN_TRANSCRIPTIONS/` contains the existing Hamlin image-and-text batches.
- `LOC_EPOCH22_TEXT_ONLY_TRANSCRIPTIONS/` contains a reproducible text-only export of 6,477 completed Epoch 22 page drafts from four collections:
  - Anna Maria Brodeau Thornton Papers: 423 pages
  - Charles S. Hamlin Papers: 1,463 pages
  - Margaret Bayard Smith Papers: 1,330 pages
  - Samuel F. B. Morse Papers: 3,261 pages

The Epoch 22 package includes compact CSV and JSONL provenance with direct Library of Congress page, item, and IIIF image URLs. Scan images are not duplicated in that package.

The separate expanded Hamlin index-digest reread is intentionally excluded.
