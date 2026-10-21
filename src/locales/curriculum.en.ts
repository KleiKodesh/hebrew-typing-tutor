const lessonCopy: Record<string, { title: string; text: string }> = {
  s1_l1: {
    title: 'Left hand: ש, ד, ג, כ — learn the four fingers',
    text: 'Place your four left-hand fingers on the keys: pinky on ש, ring finger on ד, middle finger on ג, and index finger on כ. Find the small bump on כ; it is your anchor. Press each key slowly and release it right away.',
  },
  s1_l2: {
    title: 'Left hand: first combinations',
    text: 'The same four fingers, in different combinations. Read each combination silently before typing it.',
  },
  s1_l3: {
    title: 'Right hand: ח and ל, plus ך and ף',
    text: 'Rest your right index finger on ח, its home position. Find the bump on ח; it is your right-hand anchor. Your middle finger rests on ל. Return to these home keys after every keystroke. ך (ring finger) and ף (pinky) are on the same row; they will be covered in depth in Stage 4.',
  },
  s1_l4: {
    title: 'י — a focused lesson for the right index finger',
    text: 'י is in the inner column for your right index finger. Reach left from ח toward the center, then return to ח. Nearly every Hebrew word contains י, so it gets its own lesson before being combined with the other fingers. Every practice word here contains י.',
  },
  s1_l5: {
    title: 'ע — a focused lesson for the left index finger',
    text: 'ע is in the inner column for your left index finger. Reach right from כ toward the center. This key is often neglected, so it gets its own lesson. Every practice word here contains ע.',
  },
  s1_l6: {
    title: 'Both hands: all ten home-row letters',
    text: 'For the first time, use both hands together across all ten home-row letters. Varied practice can feel harder than repeating the same pattern, but it builds longer-lasting memory. That difficulty is a sign your brain is learning.',
  },
  s1_l7: {
    title: 'י and ע together: strengthen both inner reaches',
    text: 'Practice the two inner reaches, י and ע. They are easy to forget because they are away from the home position. At the end, continue if both feel automatic; repeat the exercise if either still feels uncertain.',
  },
  s1_l8: {
    title: 'Stage 1 review challenge',
    text: 'Practice all ten home-row letters with varied patterns. With three or fewer mistakes, you are ready for Stage 2. Otherwise, identify the troublesome finger and repeat its lesson. If ע or י is still uncertain, revisit Lessons 5 or 4.',
  },
  s2_l1: {
    title: 'Learn ו — right index finger, straight up (#3 in frequency)',
    text: 'ו is typed with the right hand, while most home-row letters you already know are on the left. Switching hands is often faster than moving between keys on one hand. ו is directly above ח in the same column: reach straight up, then return.',
  },
  s2_l2: {
    title: 'Learn ר — left index finger, straight up (#5 in frequency)',
    text: 'ר is directly above כ, one row up in the same column. כ is the home position for your left index finger; ר is a straight reach. Next you will learn א with the same finger but a different movement, so make ר steady first.',
  },
  s2_l3: {
    title: 'Learn א — left index finger, diagonal reach (#4 in frequency)',
    text: 'א is in the inner column and requires a diagonal reach inward and upward. It is a frequent Hebrew letter with a less familiar movement, so it gets a focused lesson. Notice the difference: ר is straight up from כ; א is diagonal from ע. Every practice word contains א.',
  },
  s2_l4: {
    title: 'ר and א together — two movements for the left index finger',
    text: 'Now combine ר and א instead of practicing them separately. The mixed patterns make the next movement less predictable and help the two movements settle into memory. ר is straight up from כ; א is diagonal from ע. If either feels uncertain, pause and practice it on its own.',
  },
  s2_l5: {
    title: 'ו and ט together — two movements for the right index finger',
    text: 'Learn to distinguish ו (straight up from ח) from ט (diagonal inward and up from י). The goal is for your fingers to choose the correct movement automatically, leaving your attention free to think about what to type. Every practice word contains ו or ט.',
  },
  s2_l6: {
    title: 'Learn ק — left middle finger, straight up',
    text: 'ק is a straight reach one row above ג with your left middle finger. The practice words are long enough to help familiar words begin to flow as units, rather than as separate letters. Keep practicing without trying to force that transition.',
  },
  s2_l7: {
    title: 'Learn ן — right middle finger, straight up (and distinguish it from ו)',
    text: 'ן has its own lesson because it is often confused with ו. The keys are on different fingers: ו uses the right index finger, while ן uses the right middle finger. Practice noticing both the key position and the correct finger.',
  },
  s2_l8: {
    title: 'Mixed practice — all 16 letters, alternating hands',
    text: 'No new letters: this is a full mix of all 16 letters learned so far. After lessons that focused on one new letter at a time, this is the first practice with no advance cue about which letter comes next.',
  },
  s2_l9: {
    title: 'Stage 2 review challenge',
    text: 'Review all the letters from Stages 1 and 2. With three or fewer mistakes, continue to Stage 3. Otherwise, identify the finger that needs more practice and return to the relevant lesson.',
  },
  s3_l1: {
    title: 'Learn ה — left index finger, straight down',
    text: 'ה is directly below כ, one row down in the same column. כ is the home position; ה is a straight downward reach. Because ה is very common, it is important to learn a consistent, correct movement.',
  },
  s3_l2: {
    title: 'Learn נ — left middle finger, straight down',
    text: 'נ is one row below ג, reached with your left middle finger. Practice the correct finger deliberately instead of relying on whichever finger happens to be available.',
  },
  s3_l3: {
    title: 'Learn ב — left ring finger, straight down',
    text: 'ב is one row below ד, reached with your left ring finger. In Hebrew, ב can appear as a standalone letter or as a prefix attached to a word. Practice it in context, including repeated movements such as בבגד.',
  },
  s3_l4: {
    title: 'Learn מ — right index finger, straight down (first introduction)',
    text: 'מ is one row below ח, reached with your right index finger. This lesson introduces the key position only. מ and its final form ם will be practiced together in depth in Stage 4.',
  },
  s3_l5: {
    title: 'Learn ת — right middle finger, straight down',
    text: 'ת is directly below ל, reached with your right middle finger. ל is the home position; ת is a straight downward reach. Do not confuse it with ד, which is on a different row.',
  },
  s3_l6: {
    title: 'Learn ז and ס — two less common letters in one lesson',
    text: 'ז is below ש and ס is below ד. They use different left-hand fingers and sit close together. Practice them slowly and deliberately before moving on to words.',
  },
  s3_l7: {
    title: 'Words using the bottom row — all three rows',
    text: 'There are no new letters. Every word includes at least one bottom-row letter, so you will practice moving between all three rows.',
  },
  s3_l8: {
    title: 'Mixed practice — three rows, maximum variety',
    text: 'Mix all 20 letters learned so far. Let your hands move without consciously planning every finger movement; focus on the words and keep your eyes on the screen.',
  },
  s3_l9: {
    title: 'Stage 3 review challenge',
    text: 'Review all 21 letters learned so far, including ת, using varied patterns. With three or fewer mistakes, continue to Stage 4. Otherwise, identify the finger that needs practice; make sure ע feels steady.',
  },
  s4_l1: {
    title: 'Learn פ — right pinky, straight up',
    text: 'פ is on the top row and uses your right pinky. פ and its final form ף are taught separately so you can first learn where each key is, then learn when to use the final form.',
  },
  s4_l2: {
    title: 'Learn צ — right index finger, straight down',
    text: 'צ is on the bottom row and uses your right index finger. Practice slowly at first; use varied combinations to build a reliable movement.',
  },
  s4_l3: {
    title: 'פ and צ together — consolidate before final forms',
    text: 'Combine the two new letters פ and צ before moving on to final forms. This is their first mixed practice, so the next letter will not always be predictable.',
  },
  s4_l4: {
    title: 'מ ↔ ם — review and learn the full pair',
    text: 'Practice מ and ם as a pair. They use the same finger and key position; ם is used only at the end of a word.',
  },
  s4_l5: {
    title: 'Final ך — the final form of כ',
    text: 'Practice distinguishing כ from ך. They use the same finger and key, but ך appears only at the end of a word.',
  },
  s4_l6: {
    title: 'פ ↔ ף — the final form of פ',
    text: 'Practice the base/final pair פ and ף. Read each pair before typing it; ף is used at the end of a word.',
  },
  s4_l7: {
    title: 'צ ↔ ץ — the final form of צ',
    text: 'Practice distinguishing צ from ץ. Both use the same key position; ץ is used at the end of a word.',
  },
  s4_l8: {
    title: 'Final ן — taught separately because it is confused with ו',
    text: 'Practice ן separately from ו. They can look similar, but they are in different positions and use different fingers.',
  },
  s4_l9: {
    title: 'All four final forms — base and final forms together',
    text: 'Practice the four final forms together with their base letters: כ/ך, מ/ם, פ/ף, and צ/ץ. Notice which form belongs at the end of each word.',
  },
  s4_l10: {
    title: 'Stage 4 review challenge',
    text: 'Review all 27 letters, including the final forms. With three or fewer mistakes, continue to Stage 5. If final forms are still confusing, repeat the relevant pair lesson.',
  },
  s5_l1: {
    title: 'Switch to recall — read, cover, type',
    text: 'From now on, read each sentence once, then type it from memory with the source hidden. This helps you develop a natural rhythm without shifting your eyes between a source and the screen.',
  },
  s5_l2: {
    title: 'Steady rhythm — even, not stop-and-start',
    text: 'Type at an even pace, keeping the gaps between keystrokes as consistent as you can—even when a word feels difficult. A steady pace is more useful than bursts of speed followed by pauses.',
  },
  s5_l3: {
    title: 'Period — end a sentence',
    text: 'The period is on the bottom row under your right pinky. After a period, leave a space before the next sentence. In Hebrew, punctuation is displayed using bidirectional text rules.',
  },
  s5_l4: {
    title: 'Comma — pause within a sentence',
    text: 'The comma is on the bottom row under your right pinky, on a different key from the period. Leave a space after a comma. Read ahead so you can anticipate punctuation instead of stopping unexpectedly.',
  },
  s5_l5: {
    title: 'Question mark — Hebrew uses ? instead of a period',
    text: 'A Hebrew question ends with ?. Type it using Shift + / with your right pinky. This is the first exercise that requires two fingers at once. The browser may display punctuation at the opposite visual edge because Hebrew is right-to-left.',
  },
  s5_l6: {
    title: 'Complete sentences with full punctuation',
    text: 'Practice periods, commas, and question marks together. Read the whole passage once, then type it. The goal is to make punctuation part of your flow rather than a reason to stop.',
  },
  s5_l7: {
    title: 'Free typing — first passage',
    text: 'Read the passage once, then type it from memory without going back to reread it. As key movements become automatic, you can focus more of your attention on what to write next.',
  },
  s5_l8: {
    title: 'Punctuation review — periods, commas, and questions',
    text: 'This is the longest passage so far with basic punctuation. Read it once, cover it, and type from memory. From the next lesson onward, you will add new punctuation marks.',
  },
  s5_l9: {
    title: 'Geresh and gershayim — abbreviations and initials',
    text: "Hebrew uses geresh (') for abbreviations and foreign words, and gershayim (\") for initials. Both are on the key to the right of ל; use Shift for gershayim.",
  },
  s5_l10: {
    title: 'Hyphen — joining words and sentence structure',
    text: 'A Hebrew hyphen can join words without spaces, as in יום-טוב, or separate parts of a sentence with spaces on both sides. The key is on the top row between 0 and the other top-row keys.',
  },
  s5_l11: {
    title: 'Colon — introduce a quotation or list',
    text: 'A colon introduces a quotation, list, or explanation. Type it with Shift and the key to the right of ל. Leave a space after the colon.',
  },
  s5_l12: {
    title: 'Parentheses — add extra information',
    text: 'Type ( with Shift+9 and ) with Shift+0; both use your right pinky. Because Hebrew is right-to-left, bidirectional display may make the parentheses look reversed.',
  },
  s5_l13: {
    title: 'Square brackets and slash — sources and divisions',
    text: 'The square brackets are on the keys to the right of ר. In academic Hebrew, brackets can mark an editor’s addition or a source. The slash is on the bottom row under your right pinky.',
  },
  s5_l14: {
    title: 'Stage 5 review challenge — all punctuation',
    text: 'Practice the longest passage in Stage 5 with all punctuation marks together. Read it once, cover it, then type from memory. Stage 6 focuses on automatic, fluent typing.',
  },
  s6_l1: {
    title: 'The 20 most common words — the foundation of Hebrew text',
    text: 'These 20 words make up about half of written Hebrew. Type them repeatedly until they begin to flow naturally.',
  },
  s6_l2: {
    title: 'Common combinations — words that move together',
    text: 'Experienced typists often type familiar word combinations as a single unit. Practice common Hebrew combinations as connected patterns instead of isolated letters.',
  },
  s6_l3: {
    title: 'Controlled speed — 80% of your maximum, 95% accuracy',
    text: 'Type faster than your usual pace, but slow down if your accuracy drops below 95%. Build speed without sacrificing accuracy.',
  },
  s6_l4: {
    title: 'First paragraph — formal style',
    text: 'Practice a formal passage with longer sentences, less common words, and formal phrasing. Keep your technique steady as the text becomes more demanding.',
  },
  s6_l5: {
    title: 'Second paragraph — conversational style',
    text: 'Practice conversational text with shorter, more frequent words and a direct style. Keep a natural rhythm throughout the passage.',
  },
  s6_l6: {
    title: 'Questions and answers — reset your rhythm between sentences',
    text: 'Type short questions and answers, allowing a natural pause between them. Keep a steady pace: do not rush the questions or slow down too much for the answers.',
  },
  s6_l7: {
    title: 'Long text — endurance',
    text: 'Maintain good technique as your fingers tire. Type through the passage without stopping, keeping your eyes on the screen and returning each finger to its home position.',
  },
  s6_l8: {
    title: 'Final challenge — accuracy, rhythm, and endurance',
    text: 'This is the longest passage in the course, combining all letters, punctuation, and common words. Type to the end while maintaining accuracy and a steady rhythm. Congratulations on completing the course.',
  },
}

const stages: Record<string, { title: string; context: string }> = {
  stage_1: {
    title: 'Stage 1: The home row',
    context: 'Learn the ten home-row letters with both hands. Each finger is responsible for its own key and returns to its home position after every keystroke. The inner reaches for י and ע are taught separately. Accuracy comes before speed; keep your eyes on the screen, not your hands.',
  },
  stage_2: {
    title: 'Stage 2: The top row',
    context: 'Learn the top-row letters by moving each finger up from its home key. Practice straight reaches before diagonal ones, and distinguish the pairs ר/א and ו/ט, which use the same finger but different movements. Keep your eyes on the screen and build accuracy before speed.',
  },
  stage_3: {
    title: 'Stage 3: The bottom row and ת',
    context: 'Learn the bottom-row letters, including ת. Practice moving between all three rows and begin to rely on the feel of each movement rather than consciously thinking about every letter. Keep your eyes on the screen.',
  },
  stage_4: {
    title: 'Stage 4: פ, צ, מ, and the final forms',
    context: 'Learn פ and צ, then practice Hebrew final forms as pairs: כ/ך, מ/ם, פ/ף, and צ/ץ. ך and ן are also reviewed. Focus on both finding each key and recognizing when its final form belongs at the end of a word.',
  },
  stage_5: {
    title: 'Stage 5: All letters learned',
    context: 'Move from copying to recall: read a passage, hide it, then type it from memory. This stage develops a steady rhythm and introduces punctuation, abbreviations, and other common symbols. Keep your eyes on the screen.',
  },
  stage_6: {
    title: 'Stage 6: Automatic typing',
    context: 'Build automatic recall by practicing common Hebrew words, phrases, and longer passages. As familiar words become complete motor patterns, your attention can focus on what you want to write. Practice accuracy, rhythm, and endurance.',
  },
}

const defaultGuidance = 'Practice for up to 20 minutes, with one lesson per day. Keep your eyes on the screen, not on your hands.'

const lessonIds = Object.keys(lessonCopy)
const guidanceOverrides: Record<string, string> = {
  s1_l1: 'Practice for up to 20 minutes, one lesson a day. If you make three mistakes in a row with the same finger, stop. Keep your eyes on the screen, not your hands.',
  s1_l2: 'Practice for up to 20 minutes, one lesson a day. Read each combination before typing it. Keep your eyes on the screen, not your hands.',
  s1_l3: 'Practice for up to 20 minutes, one lesson a day. Practice each key on its own for ten keystrokes before opening the lesson. Keep your eyes on the screen, not your hands.',
  s1_l4: 'Practice for up to 20 minutes, one lesson a day. Alternate ח, י, ח, י until the movement feels smooth. Keep your eyes on the screen, not your hands.',
  s1_l5: 'Practice for up to 20 minutes, one lesson a day. Alternate כ, ע, כ, ע until the movement feels smooth. Keep your eyes on the screen, not your hands.',
  s1_l6: 'Practice for up to 20 minutes, one lesson a day. It is fine if this feels harder than the previous lessons. Keep your eyes on the screen, not your hands.',
  s1_l7: 'Practice for up to 20 minutes, one lesson a day. If either letter feels uncertain, practice it on its own before continuing. Keep your eyes on the screen, not your hands.',
  s1_l8: 'Practice for up to 20 minutes. If you make more than three mistakes, repeat the lesson for the finger that caused them. Keep your eyes on the screen, not your hands.',
  s2_l1: 'Practice for up to 20 minutes, one lesson a day. Before you start, alternate ח, ו, ח, ו—straight up and back. Keep your eyes on the screen, not your hands.',
  s2_l2: 'Practice for up to 20 minutes, one lesson a day. Alternate כ, ר, כ, ר—straight up and back. Make ר steady before learning א. Keep your eyes on the screen, not your hands.',
  s2_l3: 'Practice for up to 20 minutes, one lesson a day. Alternate ע, א, ע, א. This is a diagonal reach inward and up, unlike ר. Keep your eyes on the screen, not your hands.',
  s2_l4: 'Practice for up to 20 minutes, one lesson a day. If ר and א get confused, alternate כ→ר→כ and ע→א→ע before continuing. Keep your eyes on the screen, not your hands.',
  s2_l5: 'Practice for up to 20 minutes, one lesson a day. Alternate ח→ו→ח and י→ט→י. ו is straight up; ט is diagonal inward and up. Keep your eyes on the screen, not your hands.',
  s2_l6: 'Practice for up to 20 minutes, one lesson a day. Alternate ג, ק, ג, ק—straight up and back. Keep your eyes on the screen, not your hands.',
  s2_l7: 'Practice for up to 20 minutes, one lesson a day. Remember that ן and ו use different fingers: ו uses the right index finger; ן uses the right middle finger. Keep your eyes on the screen, not your hands.',
  s2_l8: 'Practice for up to 20 minutes, one lesson a day. If ר and א get confused, repeat Lesson 4; if ו and ט get confused, repeat Lesson 5. Keep your eyes on the screen, not your hands.',
  s2_l9: 'Practice for up to 20 minutes. Three mistakes or fewer means you are ready for Stage 3. Otherwise, identify the finger that needs practice. Keep your eyes on the screen, not your hands.',
  s3_l3: 'Practice for up to 20 minutes, one lesson a day. ב can appear as a prefix; practice it in context. Keep your eyes on the screen, not your hands.',
  s3_l5: 'Practice for up to 20 minutes, one lesson a day. Alternate ל, ת, ל, ת—straight down and back. Keep your eyes on the screen, not your hands.',
  s3_l6: 'Practice for up to 20 minutes, one lesson a day. ז and ס are less common; take your time in Zone A. Keep your eyes on the screen, not your hands.',
  s3_l7: 'Practice for up to 20 minutes, one lesson a day. Read each word before typing it. Keep your eyes on the screen, not your hands.',
  s3_l8: 'Practice for up to 20 minutes, one lesson a day. Let your hands move automatically; do not think about each finger. Keep your eyes on the screen, not your hands.',
  s3_l9: 'Practice for up to 20 minutes. Three mistakes or fewer means you are ready for Stage 4. Keep your eyes on the screen, not your hands.',
  s4_l2: 'Practice for up to 20 minutes, one lesson a day. צ is less common; take your time in Zone A. Keep your eyes on the screen, not your hands.',
  s4_l4: 'Practice for up to 20 minutes, one lesson a day. The same finger uses the same key; ם is used only at the end of a word. Keep your eyes on the screen, not your hands.',
  s4_l5: 'Practice for up to 20 minutes, one lesson a day. The same finger uses the same key; ך is used only at the end of a word. Keep your eyes on the screen, not your hands.',
  s4_l6: 'Practice for up to 20 minutes, one lesson a day. In Zone B, read each base/final pair before typing it. Keep your eyes on the screen, not your hands.',
  s4_l8: 'Practice for up to 20 minutes, one lesson a day. ן and ו can be confused because they look alike, not only because of their positions. Keep your eyes on the screen, not your hands.',
  s4_l10: 'Practice for up to 20 minutes. Three mistakes or fewer means you are ready for Stage 5. Keep your eyes on the screen, not your hands.',
  s5_l1: 'Practice for up to 20 minutes, one lesson a day. Read the sentence aloud once, cover it, then type it. Keep your eyes on the screen, not your hands.',
  s5_l2: 'Practice for up to 20 minutes, one lesson a day. An even pace, even if slower, is better than speeding up and stopping. Keep your eyes on the screen, not your hands.',
  s5_l3: 'Practice for up to 20 minutes, one lesson a day. The period uses the right pinky on the bottom row. Always leave a space after a period. Keep your eyes on the screen, not your hands.',
  s5_l4: 'Practice for up to 20 minutes, one lesson a day. The comma uses the right pinky on a different key from the period. Always leave a space after a comma. Keep your eyes on the screen, not your hands.',
  s5_l5: 'Practice for up to 20 minutes, one lesson a day. ? = Shift + /. Use your right pinky with Shift. Keep your eyes on the screen, not your hands.',
  s5_l6: 'Practice for up to 20 minutes, one lesson a day. Read the whole passage once, then type it. Keep your eyes on the screen, not your hands.',
  s5_l7: 'Practice for up to 20 minutes, one lesson a day. Read once, then type from memory without going back to reread. Keep your eyes on the screen, not your hands.',
  s5_l8: 'Practice for up to 20 minutes. Read once, cover the text, then type it. Keep your eyes on the screen, not your hands.',
  s5_l9: "Practice for up to 20 minutes, one lesson a day. Geresh (') is the key to the right of ל without Shift; gershayim (\") is the same key with Shift. Keep your eyes on the screen, not your hands.",
  s5_l10: 'Practice for up to 20 minutes, one lesson a day. Type a hyphen without spaces when joining words; add spaces when separating a phrase. Keep your eyes on the screen, not your hands.',
  s5_l11: 'Practice for up to 20 minutes, one lesson a day. Type a colon with Shift and the key to the right of ל. Leave a space after it. Keep your eyes on the screen, not your hands.',
  s5_l12: 'Practice for up to 20 minutes, one lesson a day. ( = Shift+9; ) = Shift+0. Both use your right pinky. Keep your eyes on the screen, not your hands.',
  s5_l13: 'Practice for up to 20 minutes, one lesson a day. [ is the key to the right of ר; ] is the key to its right. The slash is on the bottom row. Keep your eyes on the screen, not your hands.',
  s5_l14: 'Practice for up to 20 minutes. Read once, cover the text, then type. You have reached full touch typing with punctuation. Keep your eyes on the screen, not your hands.',
  s6_l1: 'Practice for up to 20 minutes, one lesson a day. Type at a flowing pace—not too slowly and not too quickly. Keep your eyes on the screen, not your hands.',
  s6_l3: 'Practice for up to 20 minutes, one lesson a day. Slow down if your accuracy drops below 95%. Keep your eyes on the screen, not your hands.',
  s6_l6: 'Practice for up to 20 minutes, one lesson a day. Keep an even pace: do not rush the questions or slow down for the answers. Keep your eyes on the screen, not your hands.',
  s6_l7: 'Practice for up to 20 minutes, one lesson a day. Type to the end without stopping. Keep your eyes on the screen, not your hands.',
  s6_l8: 'Practice for up to 20 minutes. This is the longest text in the course. Congratulations on finishing. Keep your eyes on the screen, not your hands.',
}

export const curriculumEnglish: Record<string, string> = {}

for (const [stageId, stage] of Object.entries(stages)) {
  curriculumEnglish[`curriculum.${stageId}.title`] = stage.title
  curriculumEnglish[`curriculum.${stageId}.context`] = stage.context
}

for (const [lessonId, lesson] of Object.entries(lessonCopy)) {
  curriculumEnglish[`curriculum.${lessonId}.title`] = lesson.title
  curriculumEnglish[`curriculum.${lessonId}.text`] = lesson.text
  curriculumEnglish[`curriculum.${lessonId}.guidance`] = guidanceOverrides[lessonId] ?? defaultGuidance
}
