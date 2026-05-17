# Hebrew Touch Typing — Curriculum Restructuring Plan
### Derived strictly from the research. Every decision cites its source.

---

## Part 1 — What Is Actually Wrong With the Current JSON Files

Before prescribing fixes, here is a precise diagnosis of what the research says is broken.

### Problem 1: Blocked exercises throughout (the biggest structural flaw)

The current exercises are textbook blocked practice. Stage 1 Lesson 1 reads:
`שד דש שג גש שכ כש דג גד דכ כד גכ כג שד דש`
That is the same 14 pairs repeated with minor reordering — then repeated again in Lesson 2, 3, etc.

Shea & Morgan (1979) showed that blocked practice produces better *performance during the session* but significantly worse *retention and transfer* than varied (random) practice. The effect holds across 45 years of replications. Chalavi et al. (2018) found the neurochemical mechanism: blocked practice raises GABA in the visual cortex, literally suppressing the neural activity needed for memory consolidation. The research calls this out explicitly about the original stage 1 exercises by name: "The original Stage 1 exercises... are a textbook example of blocked practice — effective for performance during the session, but detrimental to retention."

**Fix required:** Every exercise string must be non-repeating and varied after the very first introduction of a new key. The first 2–3 pairs in a new-key lesson can be a short blocked warm-up (3–4 repetitions only) to allow initial motor mapping. After that, the rest of the exercise must be varied, drawing on all letters learned so far — not just the new one.

---

### Problem 2: No warm-up / cool-down structure within lessons

The current lessons are a single flat exercise string. There is no internal structure: no short "meet the new key" phase, no consolidation phase, no mixed review phase.

Salthouse (1986) describes the four phases of typed production: input → parsing → translation → execution. A novice in the cognitive phase (Stages 1–2) is processing almost entirely at the translation phase — converting letter to movement. The lesson structure must reflect this: first lock in the translation (new key + home key, slow), then move to parsing (short real words), then mix with all prior letters (retention challenge).

**Fix required:** Each lesson needs three internal zones:
1. **Introduction zone** (new key only, blocked — 4–6 pairs max): establish the motor mapping
2. **Word zone** (real Hebrew words using new key + all prior letters): activate meaningful memory
3. **Mixed/varied zone** (all letters learned to date, non-repeating): build retention

---

### Problem 3: Letter introduction order is not consistently frequency-driven

The research is explicit: letter frequency must govern introduction order, not keyboard-row grouping. The current files introduce letters by row (all home row, then all top row, then all bottom row), which is pedagogically convenient but not optimal.

The frequency data (Trost corpus, sttmedia.com, 937,426 chars; confirmed by Grokipedia 2026):
- י: 11.06% — #1
- ה: 10.87% — #2
- ו: 10.38% — #3
- א: 6.34% — #4
- ר: 6.28% — #5
- נ: 5.86% — #6
- ת: 5.85% — #7 (note: ת is currently Stage 4 L1 — far too late)
- ש: 5.14% — #8
- מ: 4.77% — #9
- ד: 4.17% — #10
- ל: 3.89% — #11
- כ: 3.77% — #12

The research itself acknowledges a constraint: you must group letters by hand/row for motor learning purposes in the earliest lessons — you can't introduce random keys on random fingers. But within that constraint, the first letter introduced in each stage should be the highest-frequency one available on that row/hand.

Current violations:
- **Stage 2 (top row):** introduces ו first (✓ correct, #3), then א (#4), then ר (#5), then ק, then ט. ק and ט are among the least frequent Hebrew letters. ט especially (extremely low frequency) should be introduced last in Stage 2, not as a dedicated lesson 5.
- **Stage 3 (bottom row):** introduces ה first (✓ correct, #2), then נ (#6 ✓), then ב. But ז and ס (introduced together in L5) are both rare — this is correct placement. מ (#9) is introduced in L4 which is reasonable. Structure here is mostly defensible.
- **Stage 4 (top row remainder + finals):** ת (#7 in the whole alphabet) is introduced here. It should have been introduced in Stage 2 alongside ו, א, ר — it is on the top row and is the 7th most frequent letter. Leaving it to Stage 4 is a significant frequency-ordering error.

**Fix required:**
- Move ת from Stage 4 L1 into Stage 2. It belongs in the top-row stage with the other high-frequency top-row letters.
- Stage 2 revised letter order: ו (L1) → א (L2) → ר (L3) → ת (L4) → ק (L5) → ט (L6)
- Stage 4 then covers only: פ, צ, and the five final forms (ך ם ן ף ץ)
- This means Stage 4 can have more lessons devoted to final forms, which are a genuine documented source of confusion (ו/ן proximity confusion, Wikipedia SI-1452-2 revision).

---

### Problem 4: ע is introduced but not given enough deliberate early attention

The research is unambiguous: Rosenberg-Adler & Weintraub (2020) documented that Israeli typists systematically underuse the pinky fingers, and ע on the right pinky is the specific documented problem letter. The current curriculum puts ע in Stage 1 L3 (right hand introduction) and L4 (dedicated ע lesson) and L6 (ע reinforcement). That structure is correct in principle.

What is missing is *why* this is happening, and the exercise design in ע lessons does not isolate the pinky properly. ע needs: (a) dedicated initial pairs where ע is always one element of the pair, (b) explicit instruction that this is the hardest finger in Hebrew, (c) no relief by ignoring ע in later lessons — it must appear in every subsequent exercise.

**Fix required:** ע must appear in a non-trivial proportion of every exercise from Stage 1 L3 onward (minimum ~20% of bigrams/words). This is not currently the case — many later exercises in Stages 1–3 use zero or one ע word.

---

### Problem 5: No lesson-level awareness of which Salthouse phase is being trained

Salthouse (1986) defines four components of skilled typing: input (chunking text into familiar units), parsing (decomposing into characters), translation (character → movement), execution (the actual keystroke). The curriculum currently treats all lessons identically. But:

- Stage 1–2 lessons are *translation-phase* lessons: the goal is letter-to-finger mapping
- Stage 3–4 lessons are *parsing-phase* lessons: the goal is character sequences and cross-hand bigrams
- Stage 5 lessons are *input-phase* lessons: the goal is chunking words, not letters
- Stage 6 lessons are *automatization* lessons: the goal is retrieval, not computation (Logan 1988)

The lesson texts must make this explicit — not with jargon, but in plain language that tells the learner what they are training and why it feels the way it does.

---

### Problem 6: No session duration or pacing guidance in the lesson data

Baddeley & Longman (1978) found that typing learning is most efficient with one session of one hour per day, and least efficient with two sessions of two hours. For this curriculum's 15–25 minute target sessions, the implication is: one session per day, stop when the time is up even if the exercise isn't finished, never double up. This is nowhere stated in the current JSON.

**Fix required:** Each lesson should have a `session_guidance` field noting: max 20 minutes, daily practice, stop and rest if making repeated errors on the same key.

---

### Problem 7: Lesson texts are instructional but not motivating — and don't explain the "paradox"

Shea & Morgan (1979) and its replications predict that learners doing varied practice will feel they are performing worse than with blocked repetition. This is real, measurable, and counterintuitive. If learners don't understand this, they will conclude varied practice is wrong and revert to self-created blocked drills. The research explicitly recommends that learners be told this.

Logan & Crump (2011) explains why looking at your hands feels helpful but is actually harmful: it collapses the two processing loops into one, destroying the parallelism that produces speed. Again — learners need to understand this or they won't believe the "eyes on screen" instruction.

**Fix required:** Specific lessons (Stage 1 L1 for eyes-on-screen, Stage 2 L4 for the varied-practice paradox) must contain a brief, direct, honest explanation of the counterintuitive finding — not vague encouragement, but the actual reason.

---

### Problem 8: Stage 5 task type is copy-typing, but research says dictation is faster for Hebrew

Abecassis et al. (2025) found that Hebrew (uniquely, unlike Arabic) shows faster key-press intervals in memory/dictation tasks than copy tasks. Gahshan-Haddad & Weintraub (2023) showed students type faster from dictation than copying. The current Stage 5 lessons still use copy-format exercises (the learner reads and types from the same screen). 

**Fix required:** Stage 5 lessons should transition to "read once, then type from memory" format — the learner is shown the sentence, it disappears or is covered, and they type it. This is a structural change to exercise format, not just exercise content. In JSON this means adding an `exercise_mode` field: `"copy"` for Stages 1–4, `"recall"` for Stage 5, `"free"` for Stage 6.

---

### Problem 9: Stage 6 word selection is correct, but instance accumulation logic is missing

Logan (1988) instance theory: automatization occurs when a word is retrieved as a pre-stored motor unit rather than computed letter-by-letter. This requires encountering the same word many times across many sessions. The current Stage 6 exercises use the top-20 frequency words correctly (of על של כי etc.) but each lesson uses them slightly differently with no deliberate repetition policy.

**Fix required:** High-frequency words from the corpus must appear in every Stage 6 exercise, not just Lesson 1. The same 10–15 words should recur across all 8 lessons so that by the end of Stage 6 the learner has typed "של" and "על" hundreds of times and retrieval is genuinely replacing computation.

---

## Part 2 — The New Lesson Structure Template

Every lesson across all stages should follow this internal structure, adapted to the stage:

```
LESSON STRUCTURE
────────────────
1. lesson_id
2. title (functional: "יד שמאל + ו — first cross-hand pairs")
3. phase_label: "cognitive" | "associative" | "automatic"
   (Weigelt Marom & Weintraub 2015; Fitts & Posner 1967)
4. salthouse_target: "translation" | "parsing" | "input" | "automatization"
   (Salthouse 1986; Logan 1988)
5. session_guidance: max time, daily cadence, when to stop
   (Baddeley & Longman 1978)
6. text: short (3–5 sentences max), covers:
   a. what the learner is training in this lesson (finger/key/concept)
   b. the honest "why" — one concrete research finding in plain language
   c. what will feel hard and why that is correct (the paradox, if applicable)
7. exercise: structured in three zones:
   a. ZONE A — introduction (new key only, 4–6 short pairs, blocked)
   b. ZONE B — words (real Hebrew words, new key dominant, ~8–12 words)
   c. ZONE C — mixed review (all letters to date, varied, non-repeating, ~12–16 words)
8. exercise_mode: "copy" | "recall" | "free"
   (Abecassis et al. 2025; Gahshan-Haddad & Weintraub 2023)
9. ע_check: true/false — flag whether ע appears in ≥20% of exercise items
   (Rosenberg-Adler & Weintraub 2020)
```

---

## Part 3 — Stage-by-Stage Restructuring Decisions

### STAGE 1: Home Row — Cognitive Phase / Translation Target

**What stays the same:**
- 8 letters, 8 lessons, split left/right hand for first two lessons each
- ע in L3 (right hand intro), dedicated ע lesson at L4 and reinforcement at L6 ✓
- Eyes-on-screen instruction from L1 ✓

**What changes:**

| Lesson | Current | Change |
|--------|---------|--------|
| L1 | Left hand pairs (blocked) | Add Zone A (4 blocked pairs), Zone B (4–6 real words using ש ד ג כ), Zone C (all left-hand combos, varied, non-repeating). Add explanation: why slow and deliberate is correct now. |
| L2 | Left hand words | Remove: this is now Zone B+C of L1. **Replace** with: ע introduction (pull ע earlier — it's the hardest finger and highest-risk for habit formation, Rosenberg-Adler 2020). New L2 = right pinky isolation: ע pairs with each right-hand home key. |
| L3 | Right hand: י ח ל ע | Becomes: full right hand introduction (all 4 letters). Zone A: short pairs. Zone B: right-hand real words. Zone C: both hands combined for first time. Explain: alternating-hand pairs are 30–60ms faster (Dhakal 2018) — this lesson is when that starts. |
| L4 | ע words | Keep dedicated ע focus. Rewrite exercise: ע must be ≥25% of all items. Add: explicit instruction that this is the documented weak spot of Israeli typists, and that training it now prevents a lifetime of pinky avoidance. |
| L5 | Both hands, words | Rewrite as: first varied mixed exercise. Explicitly tell learner: this will feel harder than L1–L4. That is the signal that real learning is happening (Shea & Morgan 1979). No blocked strings anywhere in this exercise. |
| L6 | ע everywhere | Keep ע reinforcement. Restructure exercise: Zone A = ע-dominant pairs, Zone B = high-frequency ע words (על עם עד ידע ישע ועד), Zone C = full mixed. |
| L7 | Full mix | Full varied exercise, all 8 letters. No new instruction — consolidation only. Exercise must be maximally varied: no two consecutive words sharing a starting letter. |
| L8 | Summary challenge | Keep as diagnostic. Add a pass criterion: if learner pauses more than 2 seconds on any letter, they should return to the lesson introducing that letter. |

---

### STAGE 2: Top Row — Late Cognitive / Early Associative Phase / Parsing Target

**Critical change: ת moves here from Stage 4**

Rationale: ת is the 7th most frequent letter in Hebrew (5.85%). It is on the top row (above ש — same finger, same hand as Stage 2's other letters). Leaving it to Stage 4 means learners practice without one of the most common letters for two full stages. There is no pedagogical justification for this — it is pure row-grouping logic. Row grouping should be a constraint, not a governing principle, and ת belongs here.

**Revised Stage 2 letter introduction order:**
L1: ו (3rd most frequent, above כ — left hand, most frequent top-row letter) ✓  
L2: א (4th most frequent, above ג) ✓  
L3: ר (5th most frequent, above ל — right hand) ✓  
**L4: ת (7th most frequent, above ש — left hand) ← NEW, moved from Stage 4**  
L5: ק (above י — right hand; less frequent but needed for word formation) ✓  
L6: ט (above ח — right hand; least frequent of the group) ✓  
L7: Words and varied cross-hand practice — no new letters  
L8: Summary challenge  

**Exercise design changes:**
- From L1: all exercises must mix right-hand (home row) and left-hand (new top-row letter) bigrams. Reason: alternating-hand pairs are the strongest predictor of typing speed (Dhakal 2018). Every exercise from Stage 2 onward should be designed so that most consecutive letter pairs alternate hands.
- L1–L3 text must explain the "paradox": varied practice will feel harder than Stage 1's repeated pairs. This is correct. The feeling of difficulty is the signal that GABA is low and memory consolidation is active (Chalavi 2018).
- Stage 2 exercises must continue including ע in ≥20% of words (pinky maintenance).

---

### STAGE 3: Bottom Row — Associative Phase / Parsing Target

**What stays:**
- ה first (2nd most frequent ✓), then נ (6th ✓), then ב, then מ, then ז+ס together (both rare, correct), then mixed lessons
- Structure is mostly defensible from a frequency standpoint

**What changes:**

| Lesson | Change |
|--------|--------|
| L1 (ה) | Add Zone C from the very first lesson: ה mixed with all 13 top-row and home-row letters learned so far. ה is so frequent that learners should encounter it in context immediately. |
| L5 (ז+ס) | Currently introduces two letters together, which doubles cognitive load. Justified because both are rare — but the exercise must be clearly zoned: Zone A = ז pairs, then ז+ס pairs, Zone B = ז words then ס words, Zone C = full mix including ז ס with all prior letters. |
| L6–L8 | All three must be fully varied, no repeating strings. Must use all 19 letters learned to date (8 home + 6 top including ת + נ ה ב מ ז ס). Must include ע in ≥20% of items across the exercise. |
| All lessons | Add `salthouse_target: "parsing"` — lesson texts explain that the brain is now learning to group sequences, not individual letters. This is why words feel smoother than isolated pairs. |

---

### STAGE 4: Remaining Top-Row Letters + Final Forms — Associative Phase

**What changes from the current structure:**

Since ת moves to Stage 2, Stage 4 now covers only: פ, צ, and the five final forms ך ם ן ף ץ.

This is actually better: Stage 4 now has room to give the final forms the attention they need. The ו/ן proximity confusion documented in the Wikipedia SI-1452-2 revision is a real, documented error pattern. Currently L5 and L6 introduce the five final forms in two rushed lessons. With ת gone from Stage 4, the stage can be restructured:

| Lesson | Content |
|--------|---------|
| L1 | פ introduction — left hand, above ד (currently L2, now L1 since ת is gone) |
| L2 | צ introduction — left hand, above ג |
| L3 | פ + צ words combined; note: both are relatively rare, no speed pressure |
| L4 | Final forms ך and ם — "same finger, end of word" rule. Dedicated exercise on the rule, not just the key. |
| L5 | Final form ן — isolated first because ו/ן confusion is documented. Exercise must put ו and ן in immediate proximity so the learner actively discriminates them. |
| L6 | Final forms ף and ץ |
| L7 | All final forms mixed — deliberate alternation between base and final form (כ→ך, מ→ם, נ→ן, פ→ף, צ→ץ) in the same exercise |
| L8 | Summary challenge — all letters learned including all finals |

**Exercise design note on final forms:** the exercise must include word pairs where the same root appears with the base and final form in close proximity (e.g., כתב → מלך; ספר → מלכים). This forces the learner to actively process the end-of-word rule rather than just memorizing key positions.

---

### STAGE 5: All Letters Known — Input Phase / Dictation Mode

**Critical structural change: exercise_mode shifts to "recall"**

Abecassis et al. (2025) found that Hebrew specifically (not Arabic) shows shorter key-press intervals — i.e., faster, more fluent typing — in memory/dictation tasks than in copy tasks. Gahshan-Haddad & Weintraub (2023) showed students typed faster from dictation. The visual bottleneck of looking between source and screen slows Hebrew typing in a language-specific way.

**What this means structurally:** Stage 5 exercises should be presented in "recall mode": the learner reads the sentence once, then it is hidden (or they look away), then they type from memory. In JSON this is `"exercise_mode": "recall"`.

**Lesson text must explain this explicitly:** "Stage 5 lessons ask you to read the sentence first, then type it from memory. Research on Hebrew specifically found that this single change — removing the need to look back at the source — produces measurably faster, more rhythmic typing. It feels harder at first. That is normal."

**Punctuation introduction sequence:**
- L1: Rhythm and cadence consolidation — no new concepts, just fluent sentence typing in recall mode
- L2: Nikkud-free sentences only (standard modern Hebrew)
- L3: Period (.) introduced — naqdan rule: full stop ends the motor sequence
- L4: Comma (,) introduced — the pause rule
- L5: Question mark (?) introduced — note: in Hebrew ? ends a sentence, not . 
- L6: Full sentences with mixed punctuation
- L7: Longer text — endurance (Gahshan & Weintraub 2025: composition quantity improves with touch typing)
- L8: Summary — longest text in the curriculum to this point

**BiDi note:** Parentheses and brackets behave inversely in Hebrew due to BiDi mirroring (Grokipedia 2026). Stage 5 should note this in a lesson text but not test it — it is a rendering-engine behavior, not a typing skill.

---

### STAGE 6: Automatization — Logan's Instance Theory in Practice

**What stays:**
- Top-20 frequency word list for L1 ✓ (derived from TeachMeHebrew 5M-word corpus)
- Progression from words → sentences → paragraphs ✓
- exercise_mode: "free" ✓

**What changes:**

**Instance accumulation:** Logan (1988) says automatization requires many encounters with the same item. The top-15 frequency words (של על עם כי את לא זה הוא גם אם כל עוד יש היה כן) must appear in every single Stage 6 exercise, not just L1. They should not be the focus — but they must be present. By the end of Stage 6 the learner should have typed "של" at least 50+ times. Currently this does not happen — each lesson uses different content.

**Lesson text honesty:** Dhakal et al. (2018) found that formal touch-typing training produces only ~5 wpm faster typing on average. The curriculum should be honest about this: the real benefit of touch typing is not raw speed but the separation of the outer loop (language) from the inner loop (keystrokes), which frees cognitive resources for thinking and writing. Gahshan & Weintraub (2025) confirmed this in Hebrew: touch typing improved not just speed but composition quality. Stage 6 lesson texts should frame the goal as cognitive freedom, not WPM.

**Revised Stage 6 lesson plan:**

| Lesson | Content | exercise_mode |
|--------|---------|---------------|
| L1 | Top-20 words — pure word list, no sentences | free |
| L2 | Top-20 words in common phrases — "של ה", "לא כי", "גם אם" etc. | free |
| L3 | Short sentences at 80% of learner's max speed. Explicit: accuracy must stay above 95% | free |
| L4 | News-register paragraph — top-20 words embedded throughout | free |
| L5 | Conversational register paragraph — top-20 words embedded throughout | free |
| L6 | Q&A format — short alternating sentences, forces rhythm reset between sentences | free |
| L7 | Longest exercise in curriculum — endurance, top-20 always present | free |
| L8 | Summary: longest, most varied text, all letters, all punctuation, top-20 words present | free |

---

## Part 4 — Fields to Add to Every Lesson JSON Object

```json
{
  "phase_label": "cognitive | associative | automatic",
  "salthouse_target": "translation | parsing | input | automatization",
  "exercise_mode": "copy | recall | free",
  "session_guidance": "20 דקות מקסימום. יום אחד, שיעור אחד. אם אתה טועה באותה אצבע שלוש פעמים ברצף — עצור.",
  "ayin_check": true,
  "exercise_zones": {
    "zone_a": "...",
    "zone_b": "...",
    "zone_c": "..."
  }
}
```

Where `exercise` in the current JSON becomes `zone_c` (the main varied body), and `zone_a` and `zone_b` are new structured additions. For Stage 5–6 there are no zones — just one continuous `exercise` string in recall/free mode.

---

## Part 5 — Stage Description Fields

Each stage JSON needs two description fields:

1. **`description`** (functional, 2–3 sentences): what letters/skills the stage covers, which keyboard row, how many lessons.

2. **`phase_context`** (motivational + honest, 3–5 sentences): which phase of the Weigelt Marom model this stage corresponds to, what the learner should expect to feel, one specific research finding in plain language that explains why the stage is structured as it is.

Example for Stage 1:
```
"phase_context": "זהו השלב הקוגניטיבי — כל הקשה דורשת מחשבה מודעת. זה לא חולשה; זה בדיוק איך רכישת מיומנות עובדת בהתחלה לפי מחקרי האוניברסיטה העברית. אל תנסה להיות מהיר. מחקר שבדק 74 סטודנטים ישראלים גילה שתוכנית שהתמקדה אך ורק בטכניקה — לא מהירות — הביאה לשיפור מדיד במהירות לאחר שלושה חודשים. הדיוק עכשיו הוא ההשקעה במהירות מאוחר יותר."
```

---

## Part 6 — Summary: What Changes, What Stays

| Decision | Current | New | Research basis |
|----------|---------|-----|----------------|
| Exercise structure | Single flat string, blocked | Three zones (intro/words/mixed); only Zone A is blocked | Shea & Morgan (1979); Chalavi (2018) |
| ת placement | Stage 4 L1 | Stage 2 L4 | Trost frequency corpus; frequency-ordered pedagogy |
| ע density | Ad hoc | ≥20% of items in every exercise from Stage 1 L3 onward | Rosenberg-Adler & Weintraub (2020) |
| Alternating-hand bigrams | No design intention | Explicitly designed from Stage 2 onward; exercises structured for cross-hand pairs | Dhakal et al. (2018) |
| Stage 5 exercise mode | Copy | Recall (read once, then type from memory) | Abecassis et al. (2025); Gahshan-Haddad & Weintraub (2023) |
| Stage 6 high-frequency words | L1 only | Every lesson | Logan (1988) instance theory |
| Lesson fields | id, title, text, exercise | + phase_label, salthouse_target, exercise_mode, session_guidance, ayin_check, exercise_zones | Multiple sources |
| Stage description | 1 field | 2 fields: description + phase_context | Weigelt Marom & Weintraub (2015) |
| Session guidance | Nowhere | Every lesson | Baddeley & Longman (1978) |
| Varied-practice paradox explained | Nowhere | Stage 1 L5, Stage 2 L4 | Shea & Morgan (1979) |
| Eyes-on-screen rationale | Vague instruction | Explained via two-loop model | Logan & Crump (2011) |
| Final forms (ך ם ן ף ץ) | 2 rushed lessons | 4 dedicated lessons with base↔final word pairs | Wikipedia SI-1452-2; Hebrew keyboard confusion data |

---

## Part 7 — What the Research Does NOT Justify Changing

The following aspects of the current curriculum are already correct and should not be changed:

- **8 lessons per stage** — consistent with Weigelt Marom's 14 bi-weekly lesson model
- **Home row first** — universal in touch-typing pedagogy, motor learning rationale is sound
- **ע dedicated lessons at Stage 1 L4 and L6** — already evidence-based (Rosenberg-Adler 2020)
- **Letter frequency driving introduction order within rows** — already implemented for the first letter of each stage
- **No speed instruction in Stages 1–3** — correct; technique-first approach is exactly what Weigelt Marom (2015) showed produces speed gains at 3-month follow-up
- **Top-20 frequency words in Stage 6 L1** — correctly derived from the 5M-word corpus

---

*This plan is ready for implementation. Each JSON file should be rewritten in order: Stage 1 → 2 → 3 → 4 → 5 → 6, since each stage's exercise vocabulary depends on what letters were introduced in prior stages.*