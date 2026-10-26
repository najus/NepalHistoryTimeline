# NepalHistoryTimeline
A constantly evolving timeline on the history of Nepal — now bilingual (English / नेपाली) with dates in both AD and Bikram Sambat.

Covers 1743 (Prithvi Narayan Shah) to today: unification, the Anglo-Nepalese War,
the Rana century, the return of democracy, Everest, the civil war, the republic,
the 2015 earthquake and constitution, the 2025 Gen Z protests and the 2026 election.

## Design (2026 rebuild)
- Editorial, scroll-driven timeline grouped into four eras, each colour-coded:
  Unification & Expansion · The Rana Century · Democracy & Its Interruptions · The Federal Republic
- Photos for every event (Wikimedia Commons, credited in captions), with a lightbox
- Language toggle: English / नेपाली (full translations of every event)
- Dates shown in AD and Bikram Sambat (full BS dates from 1923 on; BS year for older events)
- Era filter chips + live search, scroll-reveal cards, reading progress bar
- Vanilla HTML/CSS/JS — no frameworks, no jQuery. Data lives in `content/*.js`.

## Adding an event
Add an entry to the matching file in `content/` (`nepal_1700.js`, `nepal_1800.js`,
`nepal_1900.js`, `nepal_2000.js`), following the format of the existing events
(`name`, `year`, `date` as MM-DD-YYYY, `headline`, `resume`, optional `main_img` +
`image_dir`, plus `bs` / `bs_year`, `date_precision`, and the `_np` Nepali fields),
and make sure the file is loaded in `index.html`. Photos go in
`images/game/<year>/<image_dir>/`.
