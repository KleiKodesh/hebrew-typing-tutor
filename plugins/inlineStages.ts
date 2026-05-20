import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

const VIRTUAL_ID = 'virtual:stages'
const RESOLVED_ID = '\0virtual:stages'

const DEV_MODULE = [
  'export const stages = Promise.all(',
  '  [1,2,3,4,5,6].map(n =>',
  "    fetch(import.meta.env.BASE_URL + 'stage_' + n + '.json').then(r => r.ok ? r.json() : null)",
  '  )',
  ').then(results => results.filter(Boolean));',
].join('\n')

export function inlineStages(isBuild: boolean): Plugin {
  return {
    name: 'inline-stages',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID) return
      if (isBuild) {
        const stages = [1, 2, 3, 4, 5, 6].map((n) => {
          const filePath = path.join(process.cwd(), 'public', 'stage_' + n + '.json')
          return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        })
        return 'export const stages = ' + JSON.stringify(stages) + ';'
      }
      return DEV_MODULE
    },
  }
}
