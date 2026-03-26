import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import router from "./router";

const pinia = createPinia().use(piniaPluginPersistedstate);

createApp(App).use(router).use(pinia).mount("#app");
