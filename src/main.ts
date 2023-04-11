import { createPinia } from 'pinia'
import { createApp } from 'vue'

/* import the notification plugin */
import Notifications from '@kyvg/vue3-notification'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App.vue'
import router from './router'

import './assets/styles/main.scss'

const app = createApp(App)

// use font awesome icon component
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(Notifications)
app.use(createPinia())
app.use(router)

app.mount('#app')
