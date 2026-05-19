import { ref, onMounted, onUnmounted } from 'vue'

const ASPECT = 3.2
const MAX_HEIGHT_FRAC = 0.28

export function useKeyboardSizing(
  wrapEl: Readonly<{ value: HTMLElement | undefined }>,
  keyboardEl: Readonly<{ value: HTMLElement | undefined }>,
  unconstrained: () => boolean,
) {
  const kbWidth = ref(0)
  const kbHeight = ref(0)
  const kbMaxWidth = ref<string>('100%')

  function measureConstraints() {
    if (unconstrained()) { kbMaxWidth.value = '100%'; return }
    if (!wrapEl.value) return
    const parent = wrapEl.value.parentElement
    if (!parent) return
    const maxW = parent.getBoundingClientRect().height * MAX_HEIGHT_FRAC * ASPECT
    kbMaxWidth.value = `${maxW}px`
  }

  function measureKeyboard() {
    if (!keyboardEl.value) return
    const r = keyboardEl.value.getBoundingClientRect()
    kbWidth.value = r.width
    kbHeight.value = r.height
  }

  let ro: ResizeObserver | null = null

  onMounted(() => {
    measureConstraints()
    measureKeyboard()
    ro = new ResizeObserver(() => { measureConstraints(); measureKeyboard() })
    if (wrapEl.value?.parentElement) ro.observe(wrapEl.value.parentElement)
    if (keyboardEl.value) ro.observe(keyboardEl.value)
  })

  onUnmounted(() => ro?.disconnect())

  return { kbWidth, kbHeight, kbMaxWidth }
}
