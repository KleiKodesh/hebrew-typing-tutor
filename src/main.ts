import { createApp } from 'vue'
import App from './App.vue'

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

createApp(App).mount('#app')
