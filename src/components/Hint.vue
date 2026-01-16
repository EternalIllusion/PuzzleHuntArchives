<script lang="ts" setup>
import { markdownToHtml } from "../utils";

const hintDialogVisible = ref(false);

const showTip = async () => {
  loadTips();
  hintDialogVisible.value = true;
};

interface tip extends PuzzleTip{
  tips_id:number;
  is_open:boolean;
}

import { PuzzleTip } from "../dataschem/interfaces";
const props = defineProps<{ name?: string, hints: PuzzleTip[]}>();
const answerTips = reactive<tip[]>([]);

const loadTips = () => {
  let i=1;
  props.hints.forEach((hint)=>{
    answerTips.push({
      ...hint,
      tips_id: i,
      is_open: false
    });
    i+=1;
  })
}

const unlockTip = (id: number) => {
  const tip = answerTips.find(t => t.tips_id === id);
  if (tip) {
    tip.is_open = true;
  }
};

const slots = useSlots();
// slots.trigger?.add;
</script>

<template>
  <span @click="showTip()">
    <slot name="trigger">
      <template v-if="slots?.trigger == undefined">{{
        name ?? "提示"
      }}</template>
    </slot>
  </span>
  <el-dialog
    v-model="hintDialogVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <template #title>
      <div class="hint-header">
        <span>{{ name ?? "提示" }}</span>
        <span class="energy-point">&nbsp;</span>
      </div>
    </template>
    <div class="predefined-tips">
      <!-- <el-divider /> -->
      <div>
        <div v-for="tip in answerTips" :key="tip.tips_id" class="hint-item">
          <div class="hint-info">
            <div class="hint-title">
              <h2>
                {{ `#${tip.tips_id} ${tip.title}` }}
              </h2>
              <el-tag size="small" type="success" v-if="tip.is_open"
                >已解锁</el-tag
              >
            </div>
            <div>
              <el-button
                v-if="!tip.is_open"
                type="primary"
                @click="unlockTip(tip.tips_id)"
              >
                解锁
              </el-button>
            </div>
          </div>
          <div v-if="tip.is_open" v-html="markdownToHtml(tip.content)"></div>
        </div>
        <el-empty
          v-if="answerTips.length == 0"
          :description="'本题暂无提示'"
        ></el-empty>
      </div>
    </div>
    <template #footer>
      <el-button @click="hintDialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.hint-item {
  border-bottom: 1px solid var(--el-border-color-light);
}

.progress {
  margin: 20px 40px;
}

.progress-tip {
  text-align: center;
  font-size: 24px;
}

.hint-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
}

.energy-point {
  display: flex;
  flex-direction: column;
  text-align: right;
  padding-right: 10px;
}

.hint-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hint-title {
  display: flex;
  align-items: center;
  gap: 6px;
}

.oracle-warning {
  width: 18px;
  color: red;
}

.oracle-item {
  margin: 10px 0;
}

.oracle-title {
  font-weight: bold;
}
</style>
