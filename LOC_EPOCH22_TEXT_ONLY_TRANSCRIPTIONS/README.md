# Library of Congress handwriting transcription drafts

This repository contains **6,477 machine-generated page transcription drafts** from four Library of Congress manuscript collections.

| Collection | Pages |
|---|---:|
| Anna Maria Brodeau Thornton Papers | 423 |
| Charles S. Hamlin Papers | 1,463 |
| Margaret Bayard Smith Papers | 1,330 |
| Samuel F. B. Morse Papers | 3,261 |

## Status and limitations

These are OCR drafts, not verified ground truth or official Library of Congress transcriptions. Human review is required before quoting or using them as supervised training labels. The expanded Hamlin index-digest reread is intentionally excluded from this export.

The page images are not duplicated here. `metadata/index.csv` and `metadata/manifest.jsonl` provide the Library of Congress page, item, and IIIF image URLs for every draft.

## Layout

- `transcriptions/<collection>/<item>/<page>.txt`: page-level OCR drafts.
- `metadata/index.csv`: spreadsheet-friendly page inventory.
- `metadata/manifest.jsonl`: compact machine-readable provenance.
- `metadata/package_summary.json`: package counts and scope.

## Generation

The drafts were produced by `stanford-oval/churro-3B` with the local `churro_visual_grounding_expanded_v2/checkpoint-epoch-22` adapter using the `grounded-faithful` decoding profile. Original spelling, punctuation, abbreviations, and physical line breaks are retained where the OCR recovered them.
