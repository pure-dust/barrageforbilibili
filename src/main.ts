import * as protobuf from 'protobufjs';
import  Long from 'long';
import { createApp } from "vue"
import { createPinia } from "pinia"

protobuf.util.Long = Long;
protobuf.configure();

import { init_setting } from "./utils/preload"
import router from "./router"
import "./styles/index.less"

import App from "./App.vue"

const app = createApp(App)
app.use(createPinia())
app.use(router)
init_setting().then(() => {
  app.mount("#app")
})
