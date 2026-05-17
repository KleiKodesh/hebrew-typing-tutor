import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'hand-offsets-api',
      configureServer(server) {
        return () => {
          server.middlewares.use('/api/save-hand-offsets', (req, res, next) => {
            if (req.method === 'POST') {
              let body = ''
              req.on('data', chunk => {
                body += chunk.toString()
              })
              req.on('end', () => {
                try {
                  const data = JSON.parse(body)
                  const offsetsDir = path.join(process.cwd(), 'hand-offsets')
                  if (!fs.existsSync(offsetsDir)) {
                    fs.mkdirSync(offsetsDir, { recursive: true })
                  }

                  // Handle both single entry and array of adjustments
                  const entries = Array.isArray(data.adjustments) ? data.adjustments : [data]
                  entries.forEach((entry: any) => {
                    const filename = `${entry.finger}_row${entry.row}.json`
                    const filePath = path.join(offsetsDir, filename)
                    fs.writeFileSync(filePath, JSON.stringify(entry, null, 2))
                  })

                  res.writeHead(200, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ success: true, saved: entries.length }))
                } catch (err) {
                  res.writeHead(500, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ success: false, error: String(err) }))
                }
              })
            } else {
              next()
            }
          })
        }
      }
    }
  ],
  build: {
    outDir: 'dist'
  }
})
