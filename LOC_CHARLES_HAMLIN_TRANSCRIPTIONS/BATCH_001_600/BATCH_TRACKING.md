# Batch tracking

## Batch 001

- Collection: Charles S. Hamlin Papers
- Pages: exactly 600
- Selection: first 600 completed `charles_hamlin` predictions in append order
- First page ID: `mss246610003_page_0001`
- Last page ID: `mss246610015_page_0041`
- Frozen prediction snapshot SHA-256:
  `78c0664abc0b716c76f6979486074516b717cf043db7a17254755cb67e229e89`
- Recognition model: CHURRO LOC layout-robust adapter, epoch 22
- Status: machine-generated drafts; human review required

The complete membership of this release is defined by `manifest.jsonl`.
Later predictions—including pages already completed while this package was
being assembled—are intentionally absent.

## Creating Batch 002

Build the next release by excluding every page ID present in this package's
`manifest.jsonl`. Do not select the next batch merely by recounting the live
prediction file: the manifest is the authoritative upload ledger.

This policy makes batches non-overlapping even if OCR finishes more pages
between packaging and uploading.
