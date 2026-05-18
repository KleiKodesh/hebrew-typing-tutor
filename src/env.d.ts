/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'virtual:stages' {
  import type { Stage } from './TypingTutor/UseTyping'
  export const stages: Stage[] | Promise<Stage[]>
}
