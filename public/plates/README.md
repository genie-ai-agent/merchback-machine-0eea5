# Photographs on loan

Drop image files here named after the artifact id, e.g.

    public/plates/cursor-tab-key.jpg
    public/plates/venmo-tee.jpg

Then add a matching line to `src/data/photos.ts` with the credit and the link back to
where it came from. The record page swaps the drawn specimen plate for the photograph and
prints the credit under it. No entry in `photos.ts` means the plate stays — dropping a
file here on its own changes nothing.

Guidelines that keep the archive looking like an archive:

- roughly square, 1000–1600px on the long edge, under ~400 KB
- object on a plain surface, shot straight on
- `.jpg` for photos, `.png` only if it genuinely needs transparency

Every record's leads are listed at `/sources`, and `public/image-sources.csv` is the same
list as a worksheet with blank columns for the filename and credit line.
