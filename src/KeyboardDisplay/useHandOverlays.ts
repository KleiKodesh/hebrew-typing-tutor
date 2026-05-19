import { computed } from 'vue'
import type { Ref } from 'vue'
import { FINGER_MAP, KEY_ROW_HE, HAND_W, computeHandPos } from './HebrewKeyboard'

const KEY_ROW_EN: Record<string, number> = {
  '`':0,'~':0,'1':0,'!':0,'2':0,'@':0,'3':0,'#':0,'4':0,'$':0,'5':0,'%':0,
  '6':0,'^':0,'7':0,'&':0,'8':0,'*':0,'9':0,'(':0,'0':0,')':0,'-':0,'_':0,'=':0,'+':0,
  'q':1,'w':1,'e':1,'r':1,'t':1,'y':1,'u':1,'i':1,'o':1,'p':1,'[':1,']':1,'\\':1,
  'a':2,'s':2,'d':2,'f':2,'g':2,'h':2,'j':2,'k':2,'l':2,';':2,"'":2,
  'z':3,'x':3,'c':3,'v':3,'b':3,'n':3,'m':3,',':3,'.':3,'/':3,
  ' ':4,
}

const HOME_KEY: Record<'left' | 'right', { he: string; en: string }> = {
  left:  { he: 'כ', en: 'f' },
  right: { he: 'ח', en: 'j' },
}

function handRestPos(
  side: 'left' | 'right',
  isHebrew: boolean,
  kbWidth: number,
  kbHeight: number,
): { leftPct: number; topPct: number } {
  const fingerId = `${side}-index` as const
  const homeKey = isHebrew ? HOME_KEY[side].he : HOME_KEY[side].en
  const rowMap = isHebrew ? KEY_ROW_HE : KEY_ROW_EN
  const row = rowMap[homeKey] ?? 2
  return computeHandPos(fingerId, homeKey, row, kbWidth, kbHeight)
}

export function useHandOverlays(
  nextKey: Ref<string>,
  prevKey: Ref<string | undefined>,
  lang: Ref<'en' | 'he'>,
  kbWidth: Ref<number>,
  kbHeight: Ref<number>,
) {
  return computed(() => {
    if (!kbWidth.value || !kbHeight.value) return []

    const key = nextKey.value
    const isHebrew = lang.value === 'he'
    const rowMap = isHebrew ? KEY_ROW_HE : KEY_ROW_EN

    function resolveFingerForKey(k: string): string {
      if (k === ' ') {
        const prevFinger = prevKey.value ? FINGER_MAP[prevKey.value] : null
        const prevSide = prevFinger?.startsWith('left') ? 'left' : 'right'
        return prevSide === 'left' ? 'right-thumb' : 'left-thumb'
      }
      return FINGER_MAP[k] ?? ''
    }

    const activeFinger = key ? resolveFingerForKey(key) : null
    const activeSide = activeFinger
      ? (activeFinger.startsWith('left') ? 'left' : 'right')
      : null

    return (['left', 'right'] as const).map(side => {
      const isActive = side === activeSide
      let leftPct: number
      let topPct: number

      if (isActive && key) {
        const row = rowMap[key] ?? 2
        ;({ leftPct, topPct } = computeHandPos(activeFinger!, key, row, kbWidth.value, kbHeight.value))
      } else {
        ;({ leftPct, topPct } = handRestPos(side, isHebrew, kbWidth.value, kbHeight.value))
      }

      return {
        side,
        idle: !isActive,
        style: {
          left: `${leftPct}%`,
          top: `${topPct}%`,
          width: `${HAND_W * 100}%`,
          bottom: 'auto',
          transform: 'none',
        },
      }
    })
  })
}
