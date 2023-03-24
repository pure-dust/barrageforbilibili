import { createApp } from "vue"
import { createPinia } from "pinia"
import { init_setting } from "./utils/preload"
import router from "./router"
import "./style.css"

import App from "./App.vue"

const app = createApp(App)
app.use(createPinia())
app.use(router)
init_setting().then(() => {
  app.mount("#app")
})
