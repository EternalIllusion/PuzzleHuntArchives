<script lang="ts" setup>
import { dateFormat } from "../utils";
import { getAnswerLogById } from "../api";
import { useMsgStore } from "../stores/msg";

interface AnswerLogResponse extends ApiType.BasicResponse {
  answer_log: AnswerLogItem[];
}
interface AnswerLogItem {
  id: number;
  user_name: string;
  answer: string;
  status: number;
  create_time: number;
  dateString: string;
  statusLabel: string;
  rowClass: string;
  message: string;
}

const messageStore = useMsgStore();
const answerHistory = ref<AnswerLogItem[]>();

const isLoading = ref(false);
const dialogVisible = ref(false);
const showAnswerHistory = async (pid: number) => {
  if (!pid) {
    messageStore.toast({
      type: "warning",
      message: "题目ID不正确",
    });
    return;
  }

  dialogVisible.value = true;
  if (!import.meta.env.DEV) {
    isLoading.value = true;
    const data = await getAnswerLogById<AnswerLogResponse>(pid);
    isLoading.value = false;
    if (data.status == 1 && data.answer_log) {
      answerHistory.value = data.answer_log;
      dialogVisible.value = true;
    }
  }
};

const answerStatusLabelMap = new Map([
  [1, { type: "success", label: "正确" }],
  [2, { type: "danger", label: "错误" }],
  [3, { type: "info", label: "提交次数不足" }],
  [4, { type: "warning", label: "里程碑" }],
]);

defineProps<{ name?: string }>();
const route = useRoute();
const pid = computed(() => {
  return parseInt(route.params.pid as string);
});
const slots = useSlots();
</script>
<template>
  <span @click="showAnswerHistory(pid)">
    <slot name="trigger">
      <template v-if="slots?.trigger == undefined">{{
        name ?? "提交记录"
      }}</template>
    </slot>
  </span>
  <el-dialog
    v-loading="isLoading"
    v-model="dialogVisible"
    :title="name ?? '提交记录'"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <el-table :data="answerHistory" :empty-text="'无提交记录'" flexible>
      <el-table-column label="提交时间">
        <template #default="scope">
          {{ dateFormat(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="user_name" label="提交者" />
      <el-table-column prop="answer" label="提交内容" />
      <el-table-column prop="statusLabel" label="状态" width="120px">
        <template #default="scope">
          <el-tag
            :type="answerStatusLabelMap.get(scope.row.status)?.type as 'success' | 'warning' | 'info' | 'primary' |'danger' "
            >{{ answerStatusLabelMap.get(scope.row.status)?.label }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column label="消息">
        <template #default="scope">
          <div v-html="scope.row.message"></div>
        </template> </el-table-column
    ></el-table>

    <template #footer>
      <el-button @click="dialogVisible = false"> 关闭 </el-button>
    </template>
  </el-dialog>
</template>
<style></style>
