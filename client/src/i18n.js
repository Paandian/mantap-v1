import { createI18n } from 'vue-i18n'
import en from './locales/en'
import bm from './locales/bm'

const i18n = createI18n({
    legacy: false, // Use Composition API mode
    locale: localStorage.getItem('user-locale') || 'bm', // Default to BM or saved preference
    fallbackLocale: 'bm',
    messages: {
        en,
        bm
    }
})

export default i18n
