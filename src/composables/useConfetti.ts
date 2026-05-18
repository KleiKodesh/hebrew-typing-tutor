import confetti from 'canvas-confetti'

export function fireConfetti() {
  const count = 180
  const defaults = { startVelocity: 30, spread: 70, ticks: 60, zIndex: 9999 }

  function burst(options: confetti.Options) {
    confetti({ ...defaults, ...options })
  }

  // two cannons from bottom-left and bottom-right
  burst({ particleCount: count * 0.6, origin: { x: 0.25, y: 1 }, angle: 70 })
  burst({ particleCount: count * 0.6, origin: { x: 0.75, y: 1 }, angle: 110 })
  // small center pop
  burst({ particleCount: count * 0.3, origin: { x: 0.5, y: 0.9 }, spread: 120, startVelocity: 20 })
}
