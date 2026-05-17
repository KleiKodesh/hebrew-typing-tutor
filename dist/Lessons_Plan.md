# Hebrew Touch Typing — Curriculum & App Implementation Plan
### Derived strictly from the research. Every decision cites its source.
### Last updated: May 2026

---

## Status Overview

| Layer | Status |
|-------|--------|
| JSON curriculum data (all 6 stages) | ✅ Complete |
| App: zone-aware exercise flow (A→B→C) | ✅ Implemented |
| App: recall mode (Stage 5) | ✅ Implemented |
| App: free mode (Stage 6) | ✅ Implemented |
| App: 20-min session timer with warning | ✅ Implemented |
| App: ע accuracy tracking per lesson | ✅ Implemented |
| App: lesson completion summary overlay | ✅ Implemented |
| App: English keyboard detection & warning | ✅ Implemented |
| App: stats bar (accuracy, wpm, progress, ע) | ✅ Implemented |
| App: fluid font sizes (clamp, scales with screen) | ✅ Implemented |
| App: dark mode | ✅ Implemented |
| App: phase label in Hebrew in nav bar | ✅ Implemented |
| phase_label translated to Hebrew in all JSONs | ✅ Done |

---

## Part 1 — Curriculum Design Decisions (All Implemented)

### Decision 1: Three-zone exercise structure

Every lesson in Stages 1–4 uses three internal zones:

- **Zone A** — Introduction (new key only, 4–6 blocked pairs): establishes the motor mapping
- **Zone B** — Words (real Hebrew words, new key dominant): activates meaningful memory
- **Zone C** — Mixed review (all letters to date, varied, non-repeating): builds retention

The app presents these as distinct steps with a visual zone progress bar. The user completes Zone A before Zone B is shown, and Zone B before Zone C.

**Research basis:** Shea & Morgan (1979) — blocked practice produces better in-session performance but worse retention. Chalavi et al. (2018) — blocked practice raises GABA in the visual cortex, suppressing memory consolidation. Zone A is the only blocked portion; Zones B and C are fully varied.

Stages 5–6 have no zones (zone_a and zone_b are null). Stage 5 uses recall mode; Stage 6 uses free mode.

---

### Decision 2: ת moved to Stage 2

ת is the 7th most frequent Hebrew letter (5.85%, Trost corpus). It sits on the top row above ש — the same row as Stage 2's other letters. Leaving it in Stage 4 meant learners practiced two full stages without one of the most common letters.

**Current placement:** Stage 2, Lesson 4.

**Stage 2 letter order:** ו (L1, #3 frequency) → א (L2, #4) → ר (L3, #5) → ת (L4, #7) → ק (L5) → ט (L6)

---

### Decision 3: ע density ≥20% from Stage 1 L3 onward

Rosenberg-Adler & Weintraub (2020) documented that Israeli typists systematically underuse the right pinky. ע is the specific documented problem letter. Every exercise from Stage 1 L3 onward has `ayin_check: true` and is designed so ע appears in ≥20% of items.

The app tracks ע accuracy separately and displays it in the stats bar and lesson summary. If ע accuracy falls below 80% at lesson completion, the summary shows a specific warning recommending the learner return to the dedicated ע lesson.

---

### Decision 4: Stage 5 — recall mode

Abecassis et al. (2025) found that Hebrew (uniquely, unlike Arabic) shows shorter key-press intervals in memory/dictation tasks than copy tasks. Gahshan-Haddad & Weintraub (2023) confirmed students type faster from dictation.

**Implementation:** Stage 5 uses `exercise_mode: "recall"`. The app shows the exercise text, then hides it when the user clicks "קראתי — הסתר והתחל". The user types from memory. The text does not reappear during typing.

---

### Decision 5: Stage 6 — free mode with anchor words

Logan (1988) instance theory: automatization requires many encounters with the same item. The top-15 frequency words (של על עם כי את לא זה הוא גם אם כל עוד יש היה כן) appear in every Stage 6 lesson.

**Implementation:** Stage 6 uses `exercise_mode: "free"`. The app shows a plain textarea with no target text. The stage JSON includes a `high_frequency_anchor_words` array at the top level.

---

### Decision 6: Session timer (20 minutes)

Baddeley & Longman (1978): one session of one hour per day is most efficient; two sessions of two hours per day is least efficient. For this curriculum's 20-minute target sessions, the implication is: one session per day, stop when the time is up.

**Implementation:** The app starts a countdown timer when the user begins typing. At 18 minutes a warning appears in the nav bar (amber). At 20 minutes a full-screen overlay stops the session and explains the research basis.

---

### Decision 7: Phase labels in Hebrew

All `phase_label` values in the JSON files are in Hebrew:
- `"קוגניטיבי"` (Stages 1–2)
- `"אסוציאטיבי"` (Stages 3–5)
- `"automatic"` → displayed as `"אוטומטי"` (Stage 6)

The phase label appears as a badge in the navigation bar.

---

### Decision 8: Lesson completion summary

After completing all zones of a lesson, the app shows a summary overlay with:
- Overall accuracy %
- WPM (characters per minute ÷ 5)
- ע accuracy % (when `ayin_check: true`)
- Warning if ע accuracy < 80%
- Two actions: repeat the lesson, or advance to the next

---

## Part 2 — JSON Data Structure (Current)

### Stage-level fields

```json
{
  "stage_id": "stage_N",
  "stage_title": "...",
  "description": "...",
  "phase_context": "...",
  "high_frequency_anchor_words": ["..."]  // Stage 6 only
}
```

### Lesson-level fields

```json
{
  "lesson_id": "sN_lM",
  "title": "...",
  "phase_label": "קוגניטיבי | אסוציאטיבי | אוטומטי",
  "salthouse_target": "translation | parsing | input | automatization",
  "exercise_mode": "copy | recall | free",
  "session_guidance": "...",
  "text": "...",
  "exercise_zones": {
    "zone_a": "string or null",
    "zone_b": "string or null",
    "zone_c": "string"
  },
  "ayin_check": true | false
}
```

`zone_a` and `zone_b` are null in Stages 5–6 and in consolidation/summary lessons (L7–L8) of Stages 1–4.

---

## Part 3 — Stage Content Summary

### Stage 1 — Home Row (ש ד ג כ | י ח ל ע)
- Phase: קוגניטיבי / translation
- Mode: copy
- L1–L2: Left hand (ש ד ג כ). ayin_check: false
- L3: Right hand intro (י ח ל ע). ayin_check: true from here on
- L4: Dedicated ע lesson (every word contains ע)
- L5: Both hands + explicit "varied practice paradox" explanation
- L6: ע reinforcement
- L7: Full mix, consolidation only
- L8: Summary challenge with pass criterion

### Stage 2 — Top Row (ו א ר ת ק ט)
- Phase: קוגניטיבי→אסוציאטיבי / translation→parsing
- Mode: copy
- ת moved here from Stage 4 (7th most frequent letter)
- L1: ו, L2: א, L3: ר, L4: ת, L5: ק, L6: ט
- L7–L8: Mixed review, all 14 letters
- All lessons: ayin_check: true

### Stage 3 — Bottom Row (ה נ ב מ ז ס)
- Phase: אסוציאטיבי / parsing
- Mode: copy
- L1: ה (2nd most frequent), L2: נ, L3: ב, L4: מ, L5: ז+ס together
- L6–L8: Mixed review, all 20 letters
- All lessons: ayin_check: true

### Stage 4 — Remaining letters + Final forms (פ צ | ך ם ן ף ץ)
- Phase: אסוציאטיבי / parsing
- Mode: copy
- L1: פ, L2: צ, L3: פ+צ combined
- L4: ך and ם (base↔final pairs)
- L5: ן alone (documented ו/ן confusion from SI-1452-2)
- L6: ף and ץ
- L7: All 5 finals mixed
- L8: Summary, all 27 letters
- All lessons: ayin_check: true

### Stage 5 — All letters known: rhythm, punctuation, recall
- Phase: אסוציאטיבי / input
- Mode: **recall** (read once, hide, type from memory)
- zone_a and zone_b are null in every lesson
- L1: Transition to recall mode
- L2: Rhythm/cadence focus
- L3: Period (.) introduced
- L4: Comma (,) introduced
- L5: Question mark (?) introduced
- L6: Full punctuation sentences
- L7: First continuous paragraph
- L8: Longest exercise so far
- All lessons: ayin_check: true

### Stage 6 — Automatization: free typing
- Phase: אוטומטי / automatization
- Mode: **free** (no target text)
- Top-level `high_frequency_anchor_words` present in every lesson's zone_c
- L1: Top-20 frequency words
- L2: Common phrases/collocations
- L3: Speed control (80% max, 95% accuracy rule)
- L4: News-register paragraph
- L5: Conversational register
- L6: Q&A format
- L7: Endurance — longest exercise
- L8: Final challenge — all letters, all punctuation, anchor words throughout
- All lessons: ayin_check: true

---

## Part 4 — App Architecture

### Components

| File | Role |
|------|------|
| `UseTyping.ts` | Core composable: all state, zone logic, recall/free modes, session timer, ע tracking, lesson summary |
| `TypingPage.vue` | Root layout: wires all components, renders overlays (session expired, lesson summary, English warning) |
| `NavigationButtons.vue` | Nav bar: stage/lesson navigation, phase badge, session timer display, dark mode toggle |
| `InputArea.vue` | Exercise strip + input strip (copy and recall-hidden modes) |
| `StatsBar.vue` | Live stats: accuracy (color-coded), WPM, progress bar, ע accuracy |
| `HandGuide.vue` | SVG hand diagram with active finger highlight |
| `KeyboardDisplay.vue` | Visual keyboard with held/next/mistake key highlighting, auto-detects Hebrew/English |

### Key composable exports (UseTyping.ts)

- `exerciseMode` — `'copy' | 'recall' | 'free'`
- `currentZone`, `currentZoneIndex`, `availableZones`, `isLastZone`, `advanceZone()`
- `recallReady`, `recallHidden`, `startRecall()`
- `sessionSecondsDisplay`, `sessionWarning`, `sessionExpired`
- `ayinAccuracy`, `ayinTotal`
- `showSummary`, `summaryData`, `dismissSummaryAndAdvance()`, `dismissSummaryAndStay()`
- `currentTarget` — the text for the current zone (used by recall panel)

### Lesson identity

Lessons are identified by `lesson_id` (preferred) with fallback to `title`. This is more robust than title-only matching.

---

## Part 5 — What Remains / Future Work

| Feature | Priority | Notes |
|---------|----------|-------|
| `generateWeakLesson()` UI entry point | Medium | The function exists in UseTyping but has no button in the UI |
| Pause detection (>2s on a key → suggest returning to that letter's lesson) | Medium | Mentioned in Stage 1 L8 pass criterion |
| Per-lesson completion tracking in localStorage | Medium | Currently only raw typed text is saved, not whether a lesson was completed |
| Stage progress overview screen | Low | A map of all stages/lessons with completion status |
| `salthouse_target` surfaced in UI | Low | Currently in data but not displayed |
| Keyboard layout toggle (SI-1452 vs standard) | Low | Currently auto-detects from keystrokes |

---

## Part 6 — Research Basis Summary

| Decision | Research |
|----------|----------|
| Three-zone structure (only Zone A blocked) | Shea & Morgan (1979); Chalavi et al. (2018) |
| ת in Stage 2 | Trost frequency corpus (sttmedia.com, 937,426 chars) |
| ע ≥20% density + dedicated lessons | Rosenberg-Adler & Weintraub (2020) |
| Alternating-hand bigrams from Stage 2 | Dhakal et al. (2018) — 136M keystroke study |
| Stage 5 recall mode | Abecassis et al. (2025); Gahshan-Haddad & Weintraub (2023) |
| Stage 6 anchor word repetition | Logan (1988) instance theory |
| 20-minute session cap | Baddeley & Longman (1978) |
| Varied-practice paradox explained in lesson text | Shea & Morgan (1979) |
| Eyes-on-screen rationale | Logan & Crump (2011) — two-loop hierarchical model |
| Final forms in 4 dedicated lessons | Wikipedia SI-1452-2; ו/ן proximity confusion |
| Technique-first, no speed instruction in Stages 1–3 | Weigelt Marom & Weintraub (2015) |
| Composition quality improves with touch typing | Gahshan & Weintraub (2025) — WoTIP program |
| Hebrew keyboard not designed for Hebrew | SI-1452 history; Yiddish typewriter origin |
| Touch typing not taught in Israeli schools | Khoury-Shaheen & Weintraub (2026) |
