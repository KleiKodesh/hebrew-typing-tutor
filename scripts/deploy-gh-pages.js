#!/usr/bin/env node
import { spawnSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'

const root = process.cwd()
const distDir = path.join(root, 'dist')
const tmpBase = os.tmpdir()
const npmPath = process.env.npm_execpath || (process.platform === 'win32' ? 'npm.cmd' : 'npm')
const npmCmd = npmPath.endsWith('.js') ? process.execPath : npmPath
const npmArgs = npmPath.endsWith('.js') ? [npmPath] : []

function exec(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    ...opts,
  })
  if (result.error) {
    throw result.error
  }
  if (result.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}`)
  }
}

function execOutput(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...opts,
  })
  if (result.error) {
    throw result.error
  }
  if (result.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}`)
  }
  return result.stdout.trim()
}

function cleanTempDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

try {
  console.log('Building production assets...')
  exec(npmCmd, [...npmArgs, 'run', 'build'], { cwd: root })

  if (!fs.existsSync(distDir) || !fs.statSync(distDir).isDirectory()) {
    throw new Error('Build output directory not found: ' + distDir)
  }

  const repoUrl = execOutput('git', ['config', '--get', 'remote.origin.url'], {
    cwd: root,
  })
  if (!repoUrl) {
    throw new Error('No git remote origin URL configured.')
  }

  const tmpDir = fs.mkdtempSync(path.join(tmpBase, 'gh-pages-'))
  console.log('Using temporary deploy directory:', tmpDir)

  try {
    fs.cpSync(distDir, tmpDir, { recursive: true })

    exec('git', ['init'], { cwd: tmpDir })
    exec('git', ['checkout', '-b', 'gh-pages'], { cwd: tmpDir })
    exec('git', ['add', '-A'], { cwd: tmpDir })
    exec('git', ['commit', '-m', 'Deploy gh-pages'], { cwd: tmpDir })
    exec('git', ['remote', 'add', 'origin', repoUrl], { cwd: tmpDir })
    exec('git', ['push', '--force', 'origin', 'gh-pages'], { cwd: tmpDir })

    console.log('Deployment complete.')
  } finally {
    cleanTempDir(tmpDir)
  }
} catch (error) {
  console.error('Deployment failed:', error.message)
  process.exit(1)
}
