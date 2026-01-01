<script setup lang="ts">
import { nextTick, ref } from 'vue';
import MessageToasts from './components/MessageToasts.vue';
import gBus from './globalBus';
import { reload } from './utils/message';
import { useRouter } from 'vue-router';
const router = useRouter();

const isRouterVisible = ref(true);
gBus.on("reload", () => {
  isRouterVisible.value = false;
  nextTick(() => {
    isRouterVisible.value = true;
  });
});

async function back() {
  let path = `/`;
  await router.push(path);
  reload();
}
</script>

<template>
  <message-toasts></message-toasts>
  <div class="main-app-view">
    <router-view v-if="isRouterVisible"></router-view>
  </div>
  <div class="nav-footer">
    <div class="container-md">
      <span class="link-main" @click="back();">EterIll's PH Archive</span> | Powered by CCBC Archive Viewer
    </div>
  </div>
</template>

<style lang="scss">
@import "../node_modules/bootstrap/dist/css/bootstrap.css";

body {
  margin: 0;
  background-color: #fefefe;
  color: #2f2f2f;
}
.main-app-view {
  min-height: 60vh;
}
.header-line {
    margin-top: 2rem;
    margin-bottom: 1rem;
}
.nav-footer {
  position: fixed;
  bottom: 0;
  left:0;
  width: 100%;
  height: 3rem;
  padding: 1rem;
  font-size: 1rem;
  color: #999999;
  background-color: #2f2f2f;
}

.container-md {
  margin-bottom: 4rem;
}

.nav-footer a {
    color: #c3cae7;
    text-decoration: none;
    transition: all .5s linear;
}
.nav-footer a:hover {
    color: #5071f5;
    text-decoration: underline;
}
.link-button-wrapper {
  button {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
.link-main {
  cursor: pointer;
}
</style>
