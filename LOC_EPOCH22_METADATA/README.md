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

The page images are not duplicated here. `index.csv` and `manifest.jsonl` provide the Library of Congress page, item, and IIIF image URLs for every draft.

## Layout

- `../LOC_ANNA_MARIA_BRODEAU_THORNTON_TRANSCRIPTIONS/<item>/<page>.txt`: Thornton drafts.
- `../LOC_CHARLES_HAMLIN_TRANSCRIPTIONS/<item>/<page>.txt`: Hamlin drafts.
- `../LOC_MARGARET_BAYARD_SMITH_TRANSCRIPTIONS/<item>/<page>.txt`: Smith drafts.
- `../LOC_SAMUEL_F_B_MORSE_TRANSCRIPTIONS/<item>/<page>.txt`: Morse drafts.
- `index.csv`: spreadsheet-friendly page inventory.
- `manifest.jsonl`: compact machine-readable provenance.
- `package_summary.json`: package counts and scope.

## Generation

The drafts were produced by `stanford-oval/churro-3B` with the local `churro_visual_grounding_expanded_v2/checkpoint-epoch-22` adapter using the `grounded-faithful` decoding profile. Original spelling, punctuation, abbreviations, and physical line breaks are retained where the OCR recovered them.
