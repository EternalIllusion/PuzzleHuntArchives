<template>
  <div class="article-container">
    <!-- 使用 flex 布局：左侧菜单 + 右侧内容 -->
    <div class="layout-wrapper">
      <!-- 侧边栏 -->
      <el-drawer v-model="drawer" title="目录" direction="btt" size="80%">
        <el-menu default-active="" class="side-menu" @select="handleCommand" mode="vertical">
          <el-menu-item v-for="v in articleKeys" :index="v.path" :command="v.path">{{ v.title }}</el-menu-item>
        </el-menu>
      </el-drawer>

      <!-- 主内容区 -->
      <div class="main-content">
        <div class="center">
          <div>
            <div class="puzzle-article-title">{{ puzzleArticle.title }}</div>
          </div>
        </div>
        <div>
          <div id="pVue" v-if="isVueMode">
            <div id="pVueApp"></div>
          </div>
          <div id="pHtmlContainer" v-else v-html="puzzleArticle.html"></div>
        </div>
        <el-menu v-if="(route.params.key as string)===('index')" default-active="" class="side-menu" @select="handleCommand" mode="vertical">
          <el-menu-item v-for="v in articleKeys" :index="v.path" :command="v.path">{{ v.title }}</el-menu-item>
        </el-menu>
      </div>
    </div>
  </div>
  <Nav :nav="[{ title: '剧情目录', path: 'menu' }]" @navclick="openMenu"></Nav>
</template>

<script setup lang="ts">
import { markdownToHtml } from "../utils";
import { ElMenu, ElMenuItem } from "element-plus";
import Nav from "../components/Nav.vue";

import * as Vue from "vue";
import puzzleVuePlugin from "../components/puzzleVue/puzzleVuePlugin";
import { getArticleByKey, getArticles } from "../api";
import { Link } from "../dataschem/interfaces";

const route = useRoute();
const currentKey = ref("")
const drawer = ref(false);
currentKey.value = route.params.key as string ?? "prologue"
// const router = useRouter();
// const progressStore = useProgressStore();
const puzzleArticle = reactive({
  title: "",
  content: "",
  html: "",
});
const isVueMode = ref(false);
const articleKeys = reactive<Link[]>([]);

const openMenu = () => {
  if (!drawer.value) drawer.value = true;
}

let __vue_app__: Vue.App<Element> | undefined = undefined;
function unmountVueApp() {
  if (__vue_app__) {
    __vue_app__?.unmount();
    __vue_app__ = undefined;
  }
}

onMounted(async () => {
  let hunt = route.params.hunt as string ?? '';
  let data = await getArticles(hunt)
  Object.assign(articleKeys, data?.links ?? []);
  loadPuzzleArticle(route.params.key as string);
});

const router = useRouter();

const handleCommand = (command: string | number | { path?: string }) => {
  console.log(command);
  router.push(`${command}`);
};


onBeforeRouteUpdate((to, from) => {
  if (to.params.key !== from.params.key || from.params.hunt !== to.params.hunt) {
    unmountVueApp();

    nextTick(() => {
      loadPuzzleArticle(to.params.key as string, to.params.hunt as string);
    });
  }
});

Vue.onBeforeUnmount(() => {
  unmountVueApp();
});

function loadPuzzleArticle(key?: string, hunt?: string) {
  if (!key) key = currentKey.value;
  if (!hunt) hunt = route.params.hunt as string ?? '';

  getArticleByKey(hunt, key).then((res) => {
    console.debug(res);
    puzzleArticle.title = res.data.title;

    if (res.data.content.startsWith("<!--use vue-->")) {
      //vue模式
      isVueMode.value = true;

      //提取template、script、style
      let template = "";
      let script = "";
      let style = "";
      let templateMatched = res.data.content.match(
        /<template>([\s\S]+?)<\/template>/
      );
      if (templateMatched) {
        template = templateMatched[1];
      }
      let scriptMatched = res.data.content.match(/<script>([\s\S]+?)<\/script>/);
      if (scriptMatched) {
        script = scriptMatched[1];
      }
      let styleMatched = res.data.content.match(/<style>([\s\S]+?)<\/style>/);
      if (styleMatched) {
        style = styleMatched[1];
      }

      nextTick(() => {
        script = script.replace(/export default/, "return ");
        let __vue_script_ = new Function(script)();
        __vue_script_.template = template;
        __vue_app__ = Vue.createApp(__vue_script_);
        __vue_app__.use(puzzleVuePlugin);
        __vue_app__.mount("#pVueApp");

        //注入style
        let pAppContainer = document.getElementById("pVue");
        if (pAppContainer) {
          let styleElement = document.createElement("style");
          styleElement.innerHTML = style;
          pAppContainer.appendChild(styleElement);
        }
      });
    } else {
      //markdown模式
      isVueMode.value = false;
      puzzleArticle.content = res.data.content;
      puzzleArticle.html = markdownToHtml(res.data.content);
    }
  });
}

// function goMain() {
//   progressStore.isFinishPrologue = true;
//   router.push("/main");
// }

(window as any)["Vue"] = Vue;
</script>

<style lang="scss">
.puzzle-article-title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 1rem;
}

.article-container {
  padding: 0 6vw;
  box-sizing: border-box;
  height: calc(100vh - 80px);
  overflow: auto;
}
</style>
