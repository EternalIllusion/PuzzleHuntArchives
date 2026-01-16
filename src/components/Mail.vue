<script lang="ts" setup>
import { markdownToHtml, dateFormat } from "../utils";
import { useMsgStore } from "../stores/msg";
import { getMail, sendMail } from "../api";
import { Refresh } from "@element-plus/icons-vue";

interface GetMailResponse extends ApiType.BasicResponse {
  total_count: number;
  messages: MailMessage[];
}
interface MailMessage {
  mid: number;
  user_name: string;
  roleid: number;
  is_read: number;
  create_time: number;
  content: string;
  formatedDate: string;
  renderedHtml: string;
}

const messageStore = useMsgStore();

const mailList = ref<MailMessage[]>([]);
const mailInfo = reactive({
  newMail: "",
  nowPage: 0,
  totalCount: 0,
  isLoading: false,
  noMore: false,
});
const dialogVisible = ref(false);
const showInbox = () => {
  resetMail();
  dialogVisible.value = true;
};
const resetMail = () => {
  mailInfo.newMail = "";
  mailInfo.nowPage = 0;
  mailInfo.totalCount = 0;
  mailInfo.isLoading = false;
  mailInfo.noMore = false;
  if (!import.meta.env.DEV) {
    mailList.value = [];
    reloadMail();
  }
};
const reloadMail = async () => {
  mailInfo.isLoading = true;
  mailInfo.nowPage += 1;

  const data = await getMail<GetMailResponse>(mailInfo.nowPage);

  if (data.status == 1) {
    mailInfo.totalCount = data.total_count;
    if (data.messages) {
      mailList.value = data.messages;
    }
    if (mailList.value.length >= mailInfo.totalCount) {
      mailInfo.noMore = true;
    }
  }
  mailInfo.isLoading = false;
};
const postMail = async () => {
  const data = await sendMail<ApiType.BasicResponse>(mailInfo.newMail);

  if (data.status == 1) {
    messageStore.toast({ message: "成功发送" });
    resetMail();
  }
};

defineProps<{ name: string }>();
const slots = useSlots();
</script>
<template>
  <span @click="showInbox">
    <slot name="trigger">
      <template v-if="slots?.trigger == undefined">{{ name }}</template>
    </slot>
  </span>
  <el-dialog
    v-model="dialogVisible"
    :title="name"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <el-form>
      <el-form-item>
        <el-input
          v-model="mailInfo.newMail"
          type="textarea"
          placeholder="使用Markdown书写要发送的内容。"
          :autosize="{ minRows: 8 }"
        />
      </el-form-item>
      <el-form-item>
        <div class="mail-preview">
          <b>预览：</b><br />
          <div v-if="mailInfo.newMail" v-html="markdownToHtml(mailInfo.newMail)"></div>
          <div v-else>预览将实时显示 Markdown 渲染结果</div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="postMail">发送</el-button>
      </el-form-item>
    </el-form>
    <el-divider />
    <div class="mail-history-container">
      <div class="mail-history-header">
        <h3>消息记录：</h3>
        <el-button :icon="Refresh" @click="resetMail">刷新</el-button>
      </div>
      <div>
        <div
          class="mail-tips"
          v-if="mailList.length == 0 && !mailInfo.isLoading"
        >
          没有消息
        </div>
        <ul class="mail-history-list">
          <li v-for="m in mailList" :key="m.mid">
            <div class="mail-card">
              <div class="mail-header">
                <span class="mail-sender"
                  >{{ m.user_name }}<RoleBadge :roleid="m.roleid"></RoleBadge
                ></span>
                <span class="mail-time">
                  <el-tag size="small" type="warning" v-if="m.is_read == 0"
                    >未读</el-tag
                  >
                  {{ dateFormat(m.create_time, "M-D HH:mm") }}
                </span>
              </div>
              <div
                class="mail-content"
                v-html="markdownToHtml(m.content)"
              ></div>
            </div>
          </li>
        </ul>
        <div
          class="mail-tips load-next-button"
          v-if="!mailInfo.noMore && mailList.length > 0"
          @click="reloadMail"
        >
          点击继续加载
        </div>
        <div class="mail-tips" v-if="mailInfo.isLoading">加载中...</div>
        <div class="mail-tips" v-if="mailInfo.noMore && mailList.length > 0">
          没有更多消息了
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false"> 关闭 </el-button>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.mail-history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mail-card {
  margin-top: 20px;
  border: 1px solid var(--el-border-color-darker);
  border-radius: 20px;
  .mail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--el-border-color-darker);
    padding: 10px;
    font-size: 18px;
    .mail-sender {
      display: flex;
      align-items: center;
      font-size: 15px;
      line-height: 18px;
      color: var(--el-text-color-primary);
      .rolebadge {
        position: unset;
      }
    }
    .mail-time {
      display: flex;
      align-items: center;
      font-size: 15px;
      line-height: 18px;
      color: var(--el-text-color-placeholder);
    }
    // .mail-read-marker {
    //   float: right;
    //   font-size: 15px;
    //   line-height: 18px;
    //   color: var(--el-color-error);
    // }
  }
  .mail-content {
    padding: 10px;
  }
}
.mail-history-list {
  overflow: auto;
  padding-left: 0;
  li {
    list-style: none;
  }
}
.mail-tips {
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  border: 1px solid var(--el-border-color-darker);
  color: var(--el-text-color-placeholder);
}
</style>
