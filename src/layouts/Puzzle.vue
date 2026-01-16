<template>
  <div class="puzzle-detail-container" :class="{ 'white-bg': isPink }">
    <!--el-link
      class="back-btn"
      :underline="false"
      :icon="ArrowLeftBold"
      @click="back2Map"
      >返回</el-link
  -->
    <div id="puzzle-content">
      <div class="header-line">
        <div v-if="areaTitle">{{ areaTitle }}</div>
        <h4 class="title-line">{{ puzzle.title }}</h4>
      </div>
      <div class="pz-content">
        <div v-html="renderedHtml"></div>
      </div>
      <el-collapse
        v-if="isFinish && puzzle.extendContent && puzzle.extendContent != ''"
        v-model="activeNames"
        class="hidden-info"
      >
        <el-collapse-item name="1">
          <template #title>
            <h2 style="padding-left: 14px">隐藏的内容</h2>
          </template>
          <div style="padding-left: 20px" v-html="renderedExtendHtml"></div>
        </el-collapse-item>
      </el-collapse>
      <div>
        <div
          v-if="puzzle.contentType == 0 && puzzle.problemImage"
          class="puzzle-image-content"
        >
          <el-image
            :src="puzzle.problemImage"
            fit="contain"
            loading="lazy"
            :alt="`${puzzle.title}`"
            :preview-src-list="[puzzle.problemImage]"
          >
            <template #placeholder>
              <div>
                <el-skeleton :loading="true" animated>
                  <template #template>
                    <el-skeleton-item
                      variant="image"
                      style="width: 240px; height: 240px"
                    />
                  </template>
                </el-skeleton>
              </div>
            </template>
          </el-image>
        </div>
        <div v-if="puzzle.contentType == 1" v-html="puzzle.content" id="puzzleHtml"></div>
        <div v-if="puzzle.contentType == 2 || puzzle.contentType == 3" id="puzzleVue">
          <div id="puzzleVueApp"></div>
        </div>
      </div>
    </div>
  </div>
  <puzzle-nav :answer="puzzle.answer" :analysis="puzzle?.answerAnalysis??''" :milestone="puzzle?.additionalAnswers??[]"
    :hunt="route.params.hunt as string" :pgid="route.params.pgid as string" :pid="route.params.pid as string"
    :hints="puzzle.tips??[]"
    :arealink="puzzle?.arealink??null"
    />

</template>

<script setup lang="ts">

import { markdownToHtml } from "../utils";
import { parse as vueSfcParser } from "@vue/compiler-sfc";

import * as Vue from "vue";
import puzzleVuePlugin from "../components/puzzleVue/puzzleVuePlugin";

import { getPuzzleInfoById } from "../api";

import { ProblemContent } from "../dataschem/interfaces";

import type { AxiosResponse } from 'axios';
import PuzzleNav from "../components/PuzzleNav.vue";
type PuzzleResponse = AxiosResponse<ProblemContent>;

const isPink = ref(false);
const pzContentHeight = ref("");

const route = useRoute();
const activeNames = ref(["1"]);

const areaTitle = ref("");

const puzzle = reactive<ProblemContent>({
  type: 'problem',
  title: "",
  extendData: undefined,
  contentType: 0,
  content: "",
  answer: "",
  desc: "",
  links: [],
});

const renderedHtml = ref("");
const renderedExtendHtml = ref("");
const isFinish = ref(false);

const powerTimer = ref<any>();
const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    if (entry.target.id == "puzzle-content") {
      // 每个entry都是一个ResizeObserverEntry对象，包含了触发变化的元素和它的新尺寸
      console.log(entry.target.clientHeight); // 输出元素的新高度
      pzContentHeight.value = entry.target.clientHeight + "px";
    }
  }
});

onMounted(() => {

  loadPuzzleDetail();
  backToTop(150);

  const pzDom = document.getElementById("puzzle-content");
  if (pzDom) {
    resizeObserver.observe(pzDom);
  }
});

function backToTop(duration: number = 500) {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  let step = Math.floor(scrollTop / (duration / 15));
  const stepFn = () => {
    scrollTop -= step;
    if (scrollTop > 0) {
      document.documentElement.scrollTop = scrollTop;
      document.body.scrollTop = scrollTop;
      requestAnimationFrame(stepFn);
    } else {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };
  requestAnimationFrame(stepFn);
}

function unloadCurrentPage() {
  clearInterval(powerTimer.value);
  powerTimer.value = undefined;
  resizeObserver.disconnect();

  if (__vue_app__) {
    __vue_app__?.unmount();
  }
}

let __vue_app__: Vue.App<Element> | undefined = undefined;
onBeforeUnmount(() => {
  unloadCurrentPage();
  // globalBus.off("puzzle-reload");
});
onBeforeRouteUpdate((to, from) => {
  if (to.params.pid != from.params.pid || to.params.hunt != from.params.hunt || to.params.pgid != from.params.pgid) {
    unloadCurrentPage();
    let newPid = to.params.pid as string;
    let newPgid = to.params.pid as string;
    let newHunt = to.params.pid as string;
    nextTick(() => {
      loadPuzzleDetail(newHunt, newPgid, newPid);
      backToTop(150);
    });
  }
});

const puzzleReload = () => {
  if (__vue_app__) {
    __vue_app__?.unmount();
  }

  nextTick(async () => {
    await loadPuzzleDetail();
  });
};
const needReload = inject("need-reload") as Ref<boolean>;

watch(
  () => needReload.value,
  (newVal) => {
    if (newVal) {
      puzzleReload();
      needReload.value = false;
    }
  }
);

async function loadPuzzleDetail(hunt?: string, pgid?: string, pid?: string) {
  console.log("puzzle-render");
  if (!hunt) hunt = route.params.hunt as string;
  if (!pgid) pgid = route.params.pgid as string;
  if (!pid) pid = route.params.pid as string;

  const data = await getPuzzleInfoById<PuzzleResponse>(hunt,pgid,pid);

  console.debug(data);

  if (data.data) {
    Object.assign(puzzle, data.data);

    console.debug(puzzle)

    if (puzzle.desc) {
      renderedHtml.value = markdownToHtml(puzzle.desc);
    }
    if (puzzle.extendContent) {
      renderedExtendHtml.value = markdownToHtml(puzzle.extendContent);
    }

    //HTML 需要解析HTML中的脚本，单独插入页面中执行
    if (puzzle.contentType == 1) {
      let html = puzzle.content;
      puzzle.content = html.replace(
        /<script.*?>([\s\S]+?)<\/script>/g,
        (_, js) => {
          nextTick(() => {
            let htmlContainer = document.getElementById("puzzleHtml");
            if (htmlContainer) {
              let script = document.createElement("script");
              script.innerHTML = js;
              htmlContainer.appendChild(script);
            }
          });

          return "";
        }
      );
    }
    //VUE 模式
    else if (puzzle.contentType == 2 || puzzle.contentType == 3) {
      // type == 2 时， 将 script 中内容视为 vue 组件，而 html 中 内容为 template 和 style。
      // type == 3 时， 将 script 中内容视为一个 vue 组件的地址，先加载 script 中的内容，然后使用 vueSfcParser 解析，提取 template, style 和 script。
      let script = puzzle.vueScript??"";
      let template = "";
      let style = "";
      if (puzzle.contentType == 2) {
        let html = puzzle.vueTemplate??"";
        let { descriptor } = vueSfcParser(html);
        template = descriptor.template?.content ?? "";
        style = descriptor.styles[0]?.content ?? "";
      } else if (puzzle.contentType == 3) {
        let vueResponse = await fetch(script);
        let vueContent = await vueResponse.text();
        let { descriptor } = vueSfcParser(vueContent);
        template = descriptor.template?.content ?? "";
        style = descriptor.styles[0]?.content ?? "";
        script = descriptor.script?.content ?? "";
      }

      puzzle.vueScript = "";
      nextTick(() => {
        script = script.replace(/export default/g, "return ");
        let __vue_script__ = new Function(script)();
        __vue_script__.template = template;
        __vue_app__ = Vue.createApp(__vue_script__);
        __vue_app__.use(puzzleVuePlugin);
        //执行安装钩子
        if (__vue_script__.ccxcPuzzleAppConfig) {
          if (__vue_script__.ccxcPuzzleAppConfig.onAppInit) {
            __vue_script__.ccxcPuzzleAppConfig.onAppInit(__vue_app__);
          }
        }
        __vue_app__.mount("#puzzleVueApp");

        //注入style
        let puzzleAppContainer = document.getElementById("puzzleVue");
        if (!puzzleAppContainer) return;
        let styleElement = document.createElement("style");
        styleElement.innerHTML = style;
        puzzleAppContainer.appendChild(styleElement);
      });
    }
  }
}

(window as any)["Vue"] = Vue;
</script>

<style lang="scss" scoped>
.back-btn {
  margin-top: 20px;
  // position: fixed;
  // top: 20px;
  // left: 6vw;
  color: var(--pz-text-color);
  font-size: 18px;
}

.back-btn:hover {
  color: var(--nav-bg-color);
}

.hidden-info {
  max-width: 1000px;
  margin-bottom: 40px;
}

.puzzle-image-content {
  max-width: 1000px;
}

.title-line {
  margin: 0;
  font-size: 1.9rem;
}

.puzzle-detail-container {
  // background-color: var(--pz-bg-color-1);
  position: relative; /* 确保伪元素能相对于它定位 */
  z-index: 0;
  background: linear-gradient(
    0deg,
    var(--pz-bg-color-1) 0%,
    var(--pz-bg-color-2) 100%
  );
  color: var(--pz-text-color);
  padding: 0 6vw;
  box-sizing: border-box;
  height: calc(100vh - 80px);
  overflow: auto;
  #puzzle-content {
    position: relative;
    z-index: 2;
  }
}

.white-bg {
  #puzzle-content {
    padding: 1vh 1.2vw;
    color: #4d4d4d !important;
  }
}

.white-bg::before {
  content: "";
  position: absolute;
  z-index: 1;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  height: v-bind(pzContentHeight);
  min-height: calc(100vh - 180px);
  width: 90%;
  border-top-left-radius: 36px;
  border-top-right-radius: 36px;
  background-color: white;
}

.pz-content {
  margin-bottom: 32px;
}

.pz-content p {
  margin-top: 0;
}
</style>
