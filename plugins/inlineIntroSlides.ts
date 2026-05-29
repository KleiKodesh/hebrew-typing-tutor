import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

const VIRTUAL_ID = 'virtual:intro-slides'
const RESOLVED_ID = '\0virtual:intro-slides'

const DEV_MODULE = [
  'export const introSlides = ',
  "  fetch(import.meta.env.BASE_URL + 'intro_slides.json?' + Date.now())",
  '    .then(r => r.ok ? r.json() : [])',
  '    .catch(() => []);',
].join('\n')

export function inlineIntroSlides(isBuild: boolean): Plugin {
  return {
    name: 'inline-intro-slides',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID) return
      if (isBuild) {
        const filePath = path.join(process.cwd(), 'public', 'intro_slides.json')
        const slides = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        return 'export const introSlides = ' + JSON.stringify(slides) + ';'
      }
      return DEV_MODULE
    },
  }
}
