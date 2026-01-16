<script lang="ts" setup>
import { markdownToHtml } from "../utils";
import { useUserStore } from "../stores/user";
import { getPuzzleInfoByGroupId } from "../api";
import router from "../router";
import { PuzzleAreaInfo } from "../stores/progress";

const props = defineProps<{
  themeColor: string;
  areaName?: string;
  pgid: number;
  fmData?: PuzzleAreaInfo;
}>();

// const route = useRoute();

const { checkLogin } = useUserStore();

const contentHtml = ref("");
const detailInfo = ref<DetailBasicInfo[]>([]);

onBeforeMount(() => {
  if (!checkLogin()) return;
  if (props?.fmData) return;
  loadPuzzleInfo(props.pgid);
  // isLoading.value = true;
  // getPuzzleInfoByGroupId<GetPuzzleInfoResponse>(props.pgid).then((data) => {
  //   detailInfo.value = data.detail_basic_info.filter(
  //     (pz) => pz.is_unlocked == 1
  //   );
  //   contentHtml.value = markdownToHtml(data.content);
  //   isLoading.value = false;
  // });
});

// onMounted(() => {
// });

interface DetailBasicInfo {
  pid: number;
  title: string;
  puzzle_type: number;
  // icon: string[];
  is_finished: number;
  is_unlocked: number;
  answer: string;
}
interface GetPuzzleInfoResponse extends ApiType.BasicResponse {
  title: string;
  content: string;
  detail_basic_info: DetailBasicInfo[];
}

function loadPuzzleInfo(pgid: number) {
  getPuzzleInfoByGroupId<GetPuzzleInfoResponse>(pgid).then((data) => {
    detailInfo.value = data.detail_basic_info.filter(
      (pz) => pz.is_unlocked == 1
    );
    contentHtml.value = markdownToHtml(data.content);
  });
}

const gotoDetail = (pid: number) => {
  router.push(`/puzzle/${pid}`);
};

const pzList = ref(null);
</script>
<template>
  <el-card class="area-card">
    <template #header
      >{{ fmData ? "Final Meta" : areaName ?? "区域标题" }}
    </template>
    <ul class="pz-list" ref="pzList">
      <li v-if="fmData" class="pz-item">
        <el-link @click="gotoDetail(fmData.pgid)">
          <span class="fm-title">
            {{ fmData.title }}
          </span>
          <!-- <span class="pz-ans">
            {{ fmData.is_finished ? fmData.answer : "" }}
          </span> -->
        </el-link>
      </li>
      <template v-else>
        <li v-for="pz in detailInfo" :key="pz.pid" class="pz-item">
          <el-link @click="gotoDetail(pz.pid)">
            <span class="pz-title">
              <el-tag
                v-if="pz.puzzle_type == 1"
                :color="themeColor"
                effect="dark"
                size="small"
                round
                style="border: none"
                >META</el-tag
              >{{ ` ${pz.title}` }}
            </span>
            <span class="pz-ans">
              {{ pz.is_finished ? pz.answer : "" }}
            </span>
          </el-link>
        </li>
      </template>
    </ul>
  </el-card>
</template>
<style lang="scss" scoped>
.text {
  color: v-bind(themeColor);
}
.area-card {
  margin: 0 auto;
  width: 90%;
  // min-height: 600px;
  border-radius: 32px;
  border: solid 12px v-bind(themeColor);
  .pz-list {
    list-style: none;
    padding-left: 0;
    height: fit-content;
    // min-height: 600px;
  }
  .pz-item {
    .pz-title {
      text-align: left;
      width: 50%;
    }
    .pz-ans {
      text-align: right;
      width: 50%;
    }
    .fm-title {
      width: 100%;
      text-align: center;
    }
  }
  :deep(.el-card__header) {
    background-color: v-bind(themeColor);
    font-family: SourceHanSansCN;
    font-size: 2rem /* 32/16 */;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.69;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
    padding-top: 0;
  }
  :deep(.el-card__body) {
    background-color: rgba(255, 229, 184, 0.5);
    .el-link {
      width: 98%;
    }

    .el-link__inner {
      width: inherit;
      display: flex;
      justify-content: space-between;
      font-size: 2rem /* 32/16 */;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.69;
      letter-spacing: normal;
      color: v-bind(themeColor);
      // overflow-x: scroll;
      word-wrap: break-word;
    }
    .el-link.is-underline:hover:after {
      border-bottom: 1px solid v-bind(themeColor);
    }
  }
}
/* 手机字体优化 */
@media screen and (max-width: 600px) {
  .area-card {
    :deep(.el-card__body) {
      .el-link__inner {
        font-size: 1rem !important/* 32/16 */;
      }
    }
  }
}
</style>
