import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import fs from 'fs'
import path from 'path'
import { inlineStages } from './plugins/inlineStages'
import { inlineIntroSlides } from './plugins/inlineIntroSlides'

export default defineConfig(({ command }) => {
  const isBuild = command === 'build'

  return {
    base: '/hebrew_immersive_typing_tutor/',

    plugins: [
      vue(),

      // Provides virtual:stages — inlined JSON at build, fetch() in dev
      inlineStages(isBuild),

      // Provides virtual:intro-slides — inlined JSON at build, fetch() in dev
      inlineIntroSlides(isBuild),

      // Inline all JS/CSS into a single HTML file (build only)
      ...(isBuild ? [viteSingleFile()] : []),

      // Dev-only: API endpoint for saving hand-offset calibration data
      {
        name: 'hand-offsets-api',
        configureServer(server) {
          return () => {
            server.middlewares.use('/api/save-hand-offsets', (req, res, next) => {
              if (req.method !== 'POST') { next(); return }
              let body = ''
              req.on('data', (chunk) => { body += chunk.toString() })
              req.on('end', () => {
                try {
                  const data = JSON.parse(body)
                  const offsetsDir = path.join(process.cwd(), 'hand-offsets')
                  if (!fs.existsSync(offsetsDir)) {
                    fs.mkdirSync(offsetsDir, { recursive: true })
                  }
                  const entries = Array.isArray(data.adjustments) ? data.adjustments : [data]
                  const publicOffsetsDir = path.join(process.cwd(), 'public', 'hand-offsets')
                  if (!fs.existsSync(publicOffsetsDir)) {
                    fs.mkdirSync(publicOffsetsDir, { recursive: true })
                  }
                  entries.forEach((entry: any) => {
                    const fileName = entry.finger + '_row' + entry.row + '.json'
                    // Write to hand-offsets/ (source of truth)
                    fs.writeFileSync(path.join(offsetsDir, fileName), JSON.stringify(entry, null, 2))
                    // Also write to public/hand-offsets/ so Vite serves it at runtime
                    fs.writeFileSync(path.join(publicOffsetsDir, fileName), JSON.stringify(entry, null, 2))
                  })
                  res.writeHead(200, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ success: true, saved: entries.length }))
                } catch (err) {
                  res.writeHead(500, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ success: false, error: String(err) }))
                }
              })
            })
          }
        },
      },
    ],

    build: {
      outDir: 'dist',
      // Everything is inlined — no need to copy public/ assets to dist/
      copyPublicDir: false,
    },
  }
})
