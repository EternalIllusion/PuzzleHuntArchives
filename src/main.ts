import { createApp } from "vue";
import App from "./App.vue";
import 'element-plus/dist/index.css'
import "./style.css";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import router from "./router";
// import * as dayjs from 'dayjs'
// import * as isLeapYear from 'dayjs/plugin/isLeapYear' // 导入插件
// import 'dayjs/locale/zh-cn' // 导入本地化语言

// dayjs.extend(isLeapYear) // 使用插件
// dayjs.locale('zh-cn') // 使用本地化语言

const pinia = createPinia().use(piniaPluginPersistedstate);

createApp(App).use(router).use(pinia).mount("#app");
