<script lang="ts" setup>
import { toast,messageBox } from "../utils/msg";
import { messageType } from "element-plus";
import { InfoFilled } from "@element-plus/icons-vue";
import { AdditionalAnswer } from "../dataschem/interfaces";

const answer = ref("");


const props = defineProps<{ answer:string, milestones:AdditionalAnswer[] }>();

const cleanAnswer = (rawAnswer: string): string => {
  return rawAnswer
    .toLowerCase()
    .replace(/[\s\u200B\u200C\uFEFF-]/g, '');
};

const sendAnswer = async () => {
  let answerString = answer.value;

  if (answerString == null || answerString == "") {
    messageBox({
      title: "错误",
      message: "答案不能为空",
      type: "error",
    });
    return;
  }

  let answer_status = 0;
  let message = '';

  if(props.answer.startsWith("%BACKEND_SCRIPT%")){
    //TODO:判题后端
  }else if(cleanAnswer(answerString)===cleanAnswer(props.answer)) {
    answer_status = 1;message="答案正确！"
  }else{
    props.milestones.forEach((m)=>{
      if(cleanAnswer(answerString)===cleanAnswer(m.answer)){
        answer_status = 3;
        message = m.message??"你目前得到的里程碑是正确的！"
      }
    })
    answer_status = 2;
    message = '答案错误！'
  }

  if (answer_status == 1) {
    toast({
      message: "答案正确！",
    });
  }

  let type: messageType = "warning";
  if (answer_status == 1) type = "success";
  else if (answer_status == 2) type = "error";
  else if (answer_status == 3) type = "info";

  messageBox({
    title: "验证结果",
    message: message,
    type: type,
  });

  answer.value = "";
};


const handleKeydown = (evt: KeyboardEvent|Event) => {
  if (evt instanceof KeyboardEvent) {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      sendAnswer();
    }
  }
};

</script>
<template>
  <div class="answer-input">
    <el-input
      placeholder="输入答案验证"
      aria-label="Answer"
      v-model="answer"
      @keydown="handleKeydown"
    >
      <template #append>
        <el-button class="answer-input-btn" @click="sendAnswer()"
          >提交</el-button
        >
      </template>
    </el-input>
    <el-tooltip placement="top">
      <template #content>
        {{
          milestones.length > 0
            ? "本题有中间答案验证"
            : "本题无中间答案验证"
        }}
      </template>
      <el-icon color="#fff">
        <InfoFilled />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.answer-input {
  display: flex;
  align-items: center;
  gap: 10px;
  transform: scale(1.6);
}
:deep(.el-input) {
  border: none !important;
}
:deep(.el-input__wrapper) {
  padding-top: 0;
  padding-bottom: 0;
  width: 20vw;
}
/* 手机字体优化 */
@media screen and (max-width: 600px) {
  .answer-input {
    display: flex;
    align-items: center;
    gap: 10px;
    transform: scale(1);
  }
  :deep(.el-input__wrapper) {
    padding-top: 0;
    padding-bottom: 0;
    width: auto;
  }
}
</style>
