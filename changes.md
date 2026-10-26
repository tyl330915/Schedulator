# Changes

## 2026-10-25 — Spreadsheet import hardening and merge fixes

### Spreadsheet import: "all instructors into one course and one time slot"

**Root cause:** The spreadsheet import pipeline had multiple bugs that combined to break the import into a non-empty database and silently produce wrong results.

#### `backupSpreadsheet.js` — merge logic completely rewritten

The old `updateCourseCounts()` iterated over *existing* courses and only updated section counts. **New courses from the spreadsheet were silently dropped.** The old `addCurrentCoursesToFaculty()` iterated over *existing* faculty, only updating their `currentCourses`, and **wiped those courses to `[]` for any faculty member not found in the spreadsheet** — including any instructor who had been manually added but wasn't in the imported file. New faculty from the spreadsheet were also dropped.

Both functions now:
- Build a lookup by course number or by `"firstName|lastName"` (lowercased)
- Iterate over **spreadsheet data** instead of existing data
- **Add new courses** (with division/title/location/method/sem/sections from the row) when they don't exist
- **Add new faculty** (with `status:""`, `available:true`) when they don't exist
- Only update `currentCourses` for matched existing faculty (no destructive wipe for unmatched)
- Back-fill missing emails on existing faculty matches
- Report `"X new faculty added (Y updated). Courses and section counts saved."`

#### `parseBlockTime.js` — hardened `classBlocks()` against malformed time values

The old `classBlocks()` compared `timePart` with exact strings like `"8:30 AM"` and had no `return` in any `default:` branch, so an unrecognised time (e.g. `"8:30"` without `" AM"` from an Excel-saved CSV) returned `undefined`, making every course unschedulable.

Fixes:
- **`normalizeTime(timeStr)`** — heuristic AM/PM suffix: hours `8`–`11` → AM, `12`+`1`–`7` → PM. Times that already have a suffix pass through unchanged. Magic-hour edge cases (12:00, 7:00) are deferred to exact string matching.
- **All six `default:` branches now `return ""`** (not `undefined`), so the Time Block fallback in `backupSpreadsheet.js` always fires for unknown formats.
- **Multi-day extraction:** `day` is normalised to the first single day (`"M/TH"` → `"M"`, `"M, TH"` → `"M"`) so the `day === "W"` branch works correctly.
- **Added `"7:00 PM"` cases** to the once-a-week (non-Wed) and Wednesday blocks (maps to `Block 7&8` / `* Wed Block 9`).
- **Final fallback `return ""`** at the bottom of `classBlocks` for truly unhandled combinations.

#### `backupSpreadsheet.js` — Time Block fallback

Added `"Time Block"` to the set of wanted CSV columns. In `setFacultyCourses`, after `classBlocks()` is called: if the result is falsy, the registrar's own `"Time Block"` column value is used as a fallback (e.g. `"* Wed Block B: 12:15-3:00 PM"`). If both are empty, `time` is set to `""` so the scheduling view skips that class.

This matches the Schedulator2027 behaviour (entry 17).

#### `backupSpreadsheet.js` — Days separator normalisation

`setFacultyCourses` now normalises comma-separated days to slash format (`days.replace(/, ?/g, "/")`) *before* computing `perWeek`, so `"M, TH"` → `"M/TH"` → `perWeek=2` instead of `perWeek=1` (which would give the wrong block type and bypass the Time Block fallback).

#### `backupSpreadsheet.js` — Semester selection guard

`loadSpreadsheet()` now checks that the user clicked "Select Semester" first (by verifying `uploadDiv.style.display === 'block'`), showing an alert if they try to load a spreadsheet without selecting a department/semester/year. Removed the erroneous `download: true` from the PapaParse config (that option is for URL downloads, not File objects).

### `currentStorage.js` — switchCurrentStore() added

The old `ssSemesterData()` in `backupSpreadsheet.js` set `currentStore` in-memory only with a raw `localforage.createInstance()`. If a user selected a different department than the one they came from, the imported data went to the right database but every subsequent page (`courses.html`, etc.) still read the old `currentStore` key and showed the previous department's data.

Added (matching Schedulator2027 pattern):
- **`openSemesterStore(name)`** — wraps `localforage.createInstance({name})`
- **`openCurrentStore(name)`** — sets globals (`currStore`, `currentStore`), updates the navbar label `#currentSemester`, dispatches a `storeReady` custom event
- **`switchCurrentStore(name)`** — persists the choice via `localforage.setItem('currentStore', name)` then calls `openCurrentStore`, so every page resolves the correct semester
- **`setCurrentStore()`** — refactored on top of `openCurrentStore`, with a fallback that clears the navbar label when no store is saved

`ssSemesterData()` in `backupSpreadsheet.js` is now `async` and calls `await switchCurrentStore(newSem)`.

### Files modified

| File | Changes |
|------|---------|
| `app/js/parseBlockTime.js` | Added `normalizeTime()`; all defaults return `""`; day normalisation; `7:00 PM` cases; final fallback |
| `app/js/backupSpreadsheet.js` | Rewrote `updateCourseCounts` (adds new courses); rewrote `addCurrentCoursesToFaculty` (adds new faculty, no destructive wipe); added Time Block fallback; days `,` → `/` normalisation; semester selection guard; removed `download:true` |
| `app/js/currentStorage.js` | Added `openSemesterStore`, `openCurrentStore`, `switchCurrentStore`; refactored `setCurrentStore` |