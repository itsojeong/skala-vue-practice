import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

// 이 프로젝트(과제 1~3)는 라우터를 쓰지 않는다. 화면 전환은 App.vue 의 탭으로 처리한다.
const app = createApp(App)

app.use(createPinia())

app.mount('#app')
