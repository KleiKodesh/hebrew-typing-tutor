export interface ExerciseZones {
  zone_a: string | null
  zone_b: string | null
  zone_c: string | null
}

export interface Lesson {
  lesson_id?: string
  title: string
  text: string
  exercise?: string
  phase_label?: string
  salthouse_target?: string
  exercise_mode?: string
  session_guidance?: string
  exercise_zones?: ExerciseZones
  ayin_check?: boolean
}

export interface Stage {
  stage_id: string
  stage_title: string
  stage_subtitle?: string
  description: string
  phase_context?: string
  high_frequency_anchor_words?: string[]
  lessons: Lesson[]
}

export type ExerciseMode = 'copy' | 'recall' | 'free'
export type ZoneKey = 'zone_a' | 'zone_b' | 'zone_c'
