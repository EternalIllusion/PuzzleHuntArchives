<script setup lang="ts">
import { markdownToHtml } from "../utils";

const analysisHtml = ref<string>("");

const dialogVisible = ref(false);

const showSolution = () => {
  analysisHtml.value = markdownToHtml(props.analysis);
  dialogVisible.value = true;
};

const props = defineProps<{ name?: string, analysis:string, answer:string }>();

const slots = useSlots();
</script>

<template>
  <span @click="showSolution()">
    <slot name="trigger">
      <template v-if="slots?.trigger == undefined">{{
        name ?? "解析"
      }}</template>
    </slot>
  </span>
  <el-dialog
    v-model="dialogVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <template #title>
      <div class="analysis-header">
        <span>{{ name ?? '解析' }}</span>
        <span class="true-answer">答案：<span class="spolier">{{ props.answer }}</span></span>
      </div>
    </template>
    <div v-if="analysisHtml.length>0" v-html="analysisHtml"></div>
    <el-empty v-else
      :description="'本题暂无解析'"
    ></el-empty>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>
<style scoped>
  .spolier {
    border-radius:3px;
    background-color: #111;
    color: #111;
    transition: all ease .3s;
  }
  .spolier:hover {
    background-color: #eee;
  }
  .analysis-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
  }
</style>
