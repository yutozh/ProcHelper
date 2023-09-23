import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './Options.vue'
import { setupApp } from '~/logic/common-setup'
import '../styles'
import 'element-plus/dist/index.css'
import 'virtual:uno.css'


const app = createApp(App)
setupApp(app)
app.use(ElementPlus)
app.mount('#app')
