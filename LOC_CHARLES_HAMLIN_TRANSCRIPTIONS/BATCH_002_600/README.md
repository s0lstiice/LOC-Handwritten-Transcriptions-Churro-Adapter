# Charles S. Hamlin transcription drafts — Batch 002

This GitHub-transfer package pairs **600 Library of Congress page images**
with machine-generated transcription drafts from **CHURRO Version5**. It excludes
every page ID already present in Batch 001.

These are OCR drafts, not official LOC transcriptions or ground truth. Every page
requires visual review before submission or publication as a completed transcript.

## Folder layout

```text
loc_charles_hamlin_transcription/
  batch_002/
    <LOC item ID>/
      <page ID>.jpg
      <page ID>.txt
manifest.jsonl
index.csv
SOURCE_ITEMS.md
RIGHTS_AND_ATTRIBUTION.md
REVIEW_CHECKLIST.md
SHA256SUMS
```

The paired files are grouped first by collection, then batch, then LOC item. The
manifest gives direct LOC page and item links, hashes, model provenance, and review
flags. Formatting aims to follow the [LOC By the People transcription guide](https://crowd.loc.gov/get-started/how-to-transcribe/),
but image-dependent decisions still require a human reviewer.
