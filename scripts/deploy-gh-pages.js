/*
========================================================
DEPLOY SCRIPT SUMMARY

What this script does:

1. Builds the project (npm run build)
2. Deploys /dist to GitHub Pages (gh-pages branch)
3. Creates a version tag like:
   v026.05.20.14.35
4. Copies dist/index.html into a TEMP release file:
   הקלדה עברית.v026.05.20.14.35.html
5. Creates a GitHub Release (if gh CLI works)
   - attaches the file
   - marks it as Latest
6. Deletes ALL temporary files (no leftovers)
7. Continues even if release creation fails

Result:
- Website updates via GitHub Pages
- Downloadable HTML available in GitHub Releases
========================================================
*/

import { spawnSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'

const root = process.cwd()
const distDir = path.join(root, 'dist')
const tmpBase = os.tmpdir()
const npmPath =
  process.env.npm_execpath ||
  (process.platform === 'win32' ? 'npm.cmd' : 'npm')
const npmCmd = npmPath.endsWith('.js') ? process.execPath : npmPath
const npmArgs = npmPath.endsWith('.js') ? [npmPath] : []

/* ---------------- helpers ---------------- */
function exec(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts })
  if (r.error) throw r.error
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed`)
}

function execOutput(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...opts,
  })
  if (r.error) throw r.error
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed`)
  return r.stdout.trim()
}

function clean(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true })
}

/* ---------------- main ---------------- */
let tmpDir = null
let tmpReleaseFile = null

try {
  console.log('Building project...')
  exec(npmCmd, [...npmArgs, 'run', 'build'], { cwd: root })
  if (!fs.existsSync(distDir)) throw new Error('dist folder not found')

  const repoUrl = execOutput('git', ['config', '--get', 'remote.origin.url'], { cwd: root })
  if (!repoUrl) throw new Error('missing git remote origin')

  /* ---------------- gh-pages deploy ---------------- */
  tmpDir = fs.mkdtempSync(path.join(tmpBase, 'gh-pages-'))
  fs.cpSync(distDir, tmpDir, { recursive: true })
  exec('git', ['init'], { cwd: tmpDir })
  exec('git', ['checkout', '-b', 'gh-pages'], { cwd: tmpDir })
  exec('git', ['add', '-A'], { cwd: tmpDir })
  exec('git', ['commit', '-m', 'deploy'], { cwd: tmpDir })
  exec('git', ['remote', 'add', 'origin', repoUrl], { cwd: tmpDir })
  exec('git', ['push', '--force', 'origin', 'gh-pages'], { cwd: tmpDir })
  console.log('gh-pages deployed')

  /* ---------------- version ---------------- */
  const now = new Date()
  const version =
    String(now.getFullYear()).slice(-3) + '.' +
    String(now.getMonth() + 1).padStart(2, '0') + '.' +
    String(now.getDate()).padStart(2, '0') + '.' +
    String(now.getHours()).padStart(2, '0') + '.' +
    String(now.getMinutes()).padStart(2, '0')

  const tag = 'v' + version
  const assetName = `הקלדה עברית.${version}.html`

  /* ---------------- temp release file ---------------- */
  tmpReleaseFile = path.join(tmpBase, 'release-asset.html')
  fs.copyFileSync(path.join(distDir, 'index.html'), tmpReleaseFile)

  /* ---------------- GitHub release ---------------- */
  console.log('Creating GitHub release...')
  exec('gh', [
    'release', 'create',
    tag,
    '--title', tag,
    '--notes', 'Auto deploy release',
    '--latest',
  ])

  console.log('Uploading asset...')
  exec('gh', [
    'release', 'upload',
    tag,
    `${tmpReleaseFile}#${assetName}`,
    '--clobber',
  ])

  console.log(`Release uploaded successfully as: ${assetName}`)
} catch (err) {
  console.error('Deploy failed:', err.message)
  process.exit(1)
} finally {
  if (tmpDir) clean(tmpDir)
  if (tmpReleaseFile && fs.existsSync(tmpReleaseFile)) fs.unlinkSync(tmpReleaseFile)
}