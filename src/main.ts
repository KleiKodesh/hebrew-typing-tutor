import { createApp } from 'vue'
import App from './App.vue'
import './styles.css'

function setVhVariable() {
	const visualHeight = (window as any).visualViewport?.height || window.innerHeight
	const vh = visualHeight * 0.01
	document.documentElement.style.setProperty('--vh', `${vh}px`)
}

setVhVariable()
window.addEventListener('resize', setVhVariable)
if ((window as any).visualViewport) {
	;(window as any).visualViewport.addEventListener('resize', setVhVariable)
	;(window as any).visualViewport.addEventListener('scroll', setVhVariable)
}

const app = createApp(App).mount('#app')

// Clean up viewport listeners if the module is hot-replaced
if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		window.removeEventListener('resize', setVhVariable)
		if ((window as any).visualViewport) {
			;(window as any).visualViewport.removeEventListener('resize', setVhVariable)
			;(window as any).visualViewport.removeEventListener('scroll', setVhVariable)
		}
	})
}
