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

### Decision 2: Stage 2 teaches six top-row letters; ת belongs to Stage 4

Stage 2 covers the six most frequent top-row letters in keyboard-finger order: ו (L1, #3 frequency) → ר (L2, #5) → א (L3, #4) → ר+א consolidation (L4) → ו+ט consolidation (L5) → ק (L6) → ן (L7).

**ט is the sixth top-row letter in Stage 2** (not ת). ט sits on the inner column of the top row, mورה ימין diagonal upward from י — the exact mirror of how א sits above ע on the left side. Because מורה ימין makes two distinct movements to reach the top row (straight up to ו, diagonal to ט), it requires the same consolidation lesson structure as מורה שמאל (straight up to ר, diagonal to א). This is grounded in Logan & Crump (2011): the inner loop manages fingers by movement pattern, not key identity.

**ת belongs in Stage 4**, where it is the first new letter introduced (L1, before פ and צ). ת sits on the bottom row (אמה ימין down from ל) — it is not a top-row letter at all. Placing it in Stage 2 was an error.

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

### Decision 9: Real words scale with cumulative letter knowledge

Zone B (and Zone C) must use the richest real-word vocabulary the learner's current letter pool allows. In the first two lessons of Stage 1, only four letters are known — genuine words are barely possible and bigram drills are acceptable. From Stage 1 L3 onward (8 letters), real Hebrew words become available and should dominate Zone B. By Stage 1 L6 (all 10 home-row letters), a substantial vocabulary is reachable — ילד, גדל, שכל, ידע, ידיד, חיל, דגל, גחל, גידל, and more. By Stage 2, the pool grows to 16 letters and the word space expands significantly. **The rule: Zone B should contain the most lexically meaningful words the current pool allows, not invented combinations. Invented bigrams are a fallback for early lessons only, not a default.**

This principle also governs Zone C: as more letters are known, Zone C should shift from short invented combinations toward real multi-syllable words and eventually recognizable phrases. The richer the vocabulary, the stronger the associative memory anchoring each finger movement to real language.

---

### Decision 10: Letters with סופיות get reduced early-stage coverage

Five Hebrew letters have final forms: כ/ך, פ/ף, מ/ם, נ/ן, צ/ץ. The final forms are covered in full in Stage 4 (four dedicated lessons). As a consequence, the base letters' final forms that appear in earlier stages — specifically ך and ף in Stage 1, and ן in Stage 2 — should be introduced briefly as "this key exists on this finger" and kept as supporting characters in exercises, not as focal letters. They do not warrant equal billing with non-final letters in those stages, and they should not receive a dedicated lesson of their own before Stage 4.

**Concretely:** In Stage 1 L3 (right-hand intro), ך and ף are acknowledged and practiced, but the lesson's center of gravity is ח and ל — the home-position keys that everything else returns to. ך and ף appear in Zone A as supporting pairs, not as the pedagogical target. In Stage 2 L7, ן gets its own lesson because of the documented ו/ן confusion (SI-1452), but the lesson is kept lean — enough to establish the finger mapping and address the confusion, not a full-length treatment.

---

### Decision 11: Research citations in lesson text must be directly actionable

The `text` field of each lesson is read by the learner immediately before typing. It should tell the learner something that changes what they are about to do, or explains something they will otherwise misunderstand about the upcoming exercise. Research citations are appropriate when they directly justify a design decision the learner is about to experience — for example, explaining why varied practice feels harder (Shea & Morgan), or why the GABA mechanism means blocked drills can suppress retention (Chalavi et al.), or why ע has its own dedicated lesson (Rosenberg-Adler & Weintraub).

Research citations are **not appropriate** when they are decorative: frequency percentages on individual letters (the learner does not need to know that ר is 6.28% to practice the ר key), historical keyboard layout trivia unrelated to the motor task at hand, or study descriptions that don't change anything about how the learner should approach the next 20 minutes.

**The test:** remove the citation. If the instruction still makes sense and the learner still knows what to do, the citation was decorative and should be cut.

---

### Decision 12: Field ownership — `text` vs `session_guidance`

These two fields have distinct jobs and must not overlap:

- **`session_guidance`** — operational reminders the learner reads before starting and may glance at mid-session: time limit, one-session-per-day rule, warm-up drill, when to stop, and the fixed closing reminder `עיניים על המסך, לא על הידיים.` Every lesson ends with this phrase in `session_guidance`. It never appears in `text`.
- **`text`** — the explanatory context for this specific lesson: what the finger does, what makes this key or transition difficult, what the learner should pay attention to. No operational reminders here.

`עיניים על המסך` is an operational reminder, not an explanation — it belongs in `session_guidance` on every lesson without exception.

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
  "session_guidance": "...(always ends with: עיניים על המסך, לא על הידיים.)",
  "text": "...(no operational reminders; no עיניים phrase)",
  "exercise_zones": {
    "zone_a": "string or null",
    "zone_b": "string or null",
    "zone_c": "string"
  },
  "ayin_check": true | false
}
```

`zone_a` and `zone_b` are null in Stages 5–6 and in consolidation/summary lessons (L7–L8) of Stages 1–4.

**Field discipline:** `session_guidance` owns all operational reminders (time, frequency, warm-up, stop conditions, eyes-on-screen). `text` owns explanation and context only. See Decision 12.

---

## Part 3 — Stage Content Summary

### Stage 1 — Home Row (ש ד ג כ | י ח ל ע)
- Phase: קוגניטיבי / translation
- Mode: copy
- L1–L2: Left hand (ש ד ג כ). Only 4 letters — bigram drills acceptable; real words minimal. ayin_check: false
- L3: Right hand intro (ח ל ך ף). ח and ל are the focal keys; ך and ף acknowledged briefly as final-form keys on those fingers, not the pedagogical target (see Decision 10). ayin_check: true from here on
- L4: Dedicated י lesson (inner reach, right hand)
- L5: Dedicated ע lesson (inner reach, left hand)
- L6: Both hands together — all 10 home-row letters; real-word vocabulary now rich enough to dominate Zone B and C
- L7: י and ע together — inner-reach consolidation
- L8: Summary challenge with pass criterion

### Stage 2 — Top Row (ו ר א ק ט ן)
- Phase: קוגניטיבי→אסוציאטיבי / translation→parsing
- Mode: copy
- ט is the sixth top-row letter taught here (not ת — ת is a bottom-row letter belonging to Stage 4)
- L1: ו, L2: ר, L3: א, L4: ר+א consolidation (same finger, two movements), L5: ו+ט consolidation (same finger, two movements), L6: ק, L7: ן
- L8–L9: Mixed review and summary challenge, all 16 letters
- All lessons: ayin_check: true

### Stage 3 — Bottom Row (ה נ ב מ ז ס)
- Phase: אסוציאטיבי / parsing
- Mode: copy
- L1: ה (2nd most frequent), L2: נ, L3: ב, L4: מ, L5: ז+ס together
- L6–L8: Mixed review, all 20 letters
- All lessons: ayin_check: true

### Stage 4 — ת + remaining letters + Final forms (ת פ צ | ך ם ן ף ץ)
- Phase: אסוציאטיבי / parsing
- Mode: copy
- L1: ת (7th most frequent; אמה ימין down from ל — bottom row, not top row)
- L2: פ, L3: צ, L4: ת+פ+צ combined
- L5: ך and ם (base↔final pairs)
- L6: ן alone (documented ו/ן confusion from SI-1452-2)
- L7: ף and ץ
- L8: All 5 finals mixed
- L9: Summary, all 27 letters
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
| ט in Stage 2 (ו+ט consolidation lesson) | Logan & Crump (2011) — inner loop manages movement patterns, not key identity; straight vs. diagonal from same finger are two distinct patterns |
| ת in Stage 4 L1 | Trost frequency corpus — ת is #7 (5.85%), bottom-row letter (אמה ימין below ל); belongs with bottom-adjacent letters, not top-row Stage 2 |
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
| Real words scale with letter pool (Decision 9) | Pedagogical principle — meaningful units build associative memory more effectively than invented combinations; no research needed to justify preferring real words when the pool allows them |
| Final-form letters get reduced early coverage (Decision 10) | Pedagogical principle — deep treatment deferred to Stage 4 where base↔final pairs are taught together; premature equal billing creates mapping confusion |
| Research citations must be directly actionable (Decision 11) | Pedagogical principle — decorative citations in pre-exercise text add cognitive load without changing learner behavior |
| `text` vs `session_guidance` field ownership (Decision 12) | Pedagogical principle — operational reminders (including עיניים על המסך) belong in `session_guidance`; `text` is explanation only |