<script lang="ts" setup>
import { markdownToHtml } from "../utils";
import { getLibrary, getArticleByKey } from "../api";
import { GetPuzzleArticleResponse } from "../layouts/Article.vue";
import { TabsPaneContext, TabPaneName } from "element-plus";
import { useProgressStore } from "../stores/progress";
import "element-plus/theme-chalk/display.css";
import { comicMap } from "../router/index.ts";

interface PuzzleLibraryItem {
  key: string;
  title: string;
  // content?: string;
  // data: string[];
}

interface GetLibraryResponse extends ApiType.BasicResponse {
  data: PuzzleLibraryItem[];
}

// const messageStore = useMsgStore();

const route = useRoute();
const { readLibraryIds, libraryVisible } = toRefs(useProgressStore());
const dialogVisible = ref(false);
watch(
  () => libraryVisible.value,
  (newVal) => {
    if (newVal) {
      console.info("showLibrary");
      nextTick(() => {
        showLibrary();
      });
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
const libraryList = reactive<{
  [key: string]: { title: string; content: string; data: string[] };
}>({});
// const tabList = computed(() => {
//   // libraryList["comic"] = {
//   //   title: "漫画",
//   //   content: "",
//   //   imgList: [] as string[],
//   // };
//   // Object.keys(comicMap).forEach((key) => {
//   //   if (localStorage.getItem(key) == "1") {
//   //     libraryList["comic"].imgList.push(...(comicMap.get(key) ?? []));
//   //   }
//   // });
//   return libraryList;
// });
const activeName = ref(Object.keys(readLibraryIds.value)[0] as string);
const currentContent = ref("");
const currentImgList = ref([] as string[]);
const loadLibrary = () => {
  getLibrary<GetLibraryResponse>().then((res) => {
    res.data.forEach((o) => {
      libraryList[o.key] = {
        title: o.title,
        content: "",
        data: [] as string[],
      };
      // if (index == tempIndex) {
      //   getArticleByKey<GetPuzzleArticleResponse>(o.key).then((res2) => {
      //     libraryList[o.key].content = res2.content;
      //     libraryList[o.key].data = res2.data;
      //   });
      // }
    });

    const index = comicMap.indexOf(route.path);
    // console.info(route.path);
    if (index != -1 && index < 7) {
      activeName.value = `g${index + 1}-prologue`;
      if (
        readLibraryIds.value["g1-prologue"] &&
        activeName.value == "g1-prologue"
      ) {
        activeName.value = "main-open";
      }
    } else if (route.params.pid == "71") {
      activeName.value = "mm-open";
    } else {
      activeName.value = "g1-prologue";
    }
    getArticleByKey<GetPuzzleArticleResponse>(activeName.value as string).then(
      (res) => {
        readLibraryIds.value[activeName.value as string] = true;
        currentContent.value = libraryList[activeName.value].content =
          res.content;
        currentImgList.value = libraryList[activeName.value].data = res.data;
      }
    );
  });
};
const showLibrary = () => {
  dialogVisible.value = true;
  loadLibrary();
};

const handleTabClick = (tab: TabsPaneContext, _event: Event) => {
  activeName.value = tab.paneName as string;
};

const handleTabChange = (tabName: TabPaneName) => {
  if (libraryList[tabName].content == "") {
    getArticleByKey<GetPuzzleArticleResponse>(tabName as string).then((res) => {
      readLibraryIds.value[tabName as string] = true;
      currentContent.value = libraryList[tabName].content = res.content;
      currentImgList.value = libraryList[tabName].data = res.data;
    });
  } else {
    currentContent.value = libraryList[tabName].content;
    currentImgList.value = libraryList[tabName].data;
  }
};
const handleClose = () => {
  libraryVisible.value = false;
  if (comicMap.includes(route.path)) {
    localStorage.setItem(route.path, "1");
  } else if (route.params.pid == "71") {
    localStorage.setItem("71", "1");
  }
};

defineProps<{ name: string }>();
const slots = useSlots();
</script>
<template>
  <span @click="showLibrary">
    <slot name="trigger">
      <template v-if="slots?.trigger == undefined">{{ name }}</template>
    </slot>
  </span>
  <el-dialog
    v-model="dialogVisible"
    :title="name"
    :append-to-body="true"
    :close-on-click-modal="false"
    @closed="handleClose"
  >
    <el-tabs
      class="hidden-sm-and-down"
      v-model="activeName"
      tab-position="left"
      @tab-click="handleTabClick"
      @tab-change="handleTabChange"
    >
      <el-tab-pane
        v-for="key in Object.keys(libraryList)"
        :name="key"
        :label="libraryList[key].title"
      >
        <div class="comic-container">
          <Comic
            v-if="currentImgList && currentImgList.length > 0"
            :images="currentImgList"
          />
          <div v-html="markdownToHtml(currentContent)" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-tabs
      class="hidden-md-and-up"
      v-model="activeName"
      tab-position="top"
      @tab-click="handleTabClick"
      @tab-change="handleTabChange"
    >
      <el-tab-pane
        v-for="key in Object.keys(libraryList)"
        :name="key"
        :label="libraryList[key].title"
      >
        <Comic
          v-if="currentImgList && currentImgList.length > 0"
          :images="currentImgList"
        />
        <div v-html="markdownToHtml(currentContent)" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭 </el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.comic-container {
  display: flex;
  justify-content: start;
}
</style>
