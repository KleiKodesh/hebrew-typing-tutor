import { useI18n } from 'vue-i18n'
import { setUiLanguage } from '../i18n'

export function useUiLanguage() {
  const { locale, t } = useI18n({ useScope: 'global' })

  return {
    language: locale,
    setLanguage: setUiLanguage,
    t: (message: string) => t(message),
  }
}
