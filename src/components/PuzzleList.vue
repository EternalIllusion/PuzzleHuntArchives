<script lang="ts" setup>
// import { markdownToHtml } from "../utils";
import router from "../router";
import { Area } from "../dataschem/interfaces";
import { getAreaInfo } from "../api";
import { badge } from "../utils";

const props = defineProps<{
  hunt: string;
  themeColor: string;
  gradientColors?: string[];
  areaName?: string;
  pgid: string;
  logo?: any;
}>();

const emits = defineEmits(["puzzle-render"]);
const cfg = reactive<Area>({title:"",problems:[]});

onBeforeMount(() => {
  loadPuzzleInfo();
});

function loadPuzzleInfo() {
  getAreaInfo(props.hunt,props.pgid).then((res) => {
    Object.assign(cfg,res);
    emits("puzzle-render",res)
  });
}

const gotoDetail = (path: string) => {
  router.push(path);
};

</script>
<template>
  <el-card class="area-card">
    <template #header>
      <img v-if="logo" :src="props.logo" class="logo" />
      <span v-else>{{ areaName ?? "区域标题" }}</span>
    </template>
    <ul class="pz-list">
      <li :class="['pz-item']" v-for="pz in cfg.problems">
        <el-link @click="gotoDetail(pz.path)">
          <span class="pz-title">
            <el-tag
              v-if="badge(pz.type)"
              :color="themeColor"
              effect="dark"
              size="small"
              round
              style="border: none"
              >{{badge(pz.type)}}</el-tag
            >
            {{ ` ${pz.title}` }}
          </span>
        </el-link>
      </li>
    </ul>
  </el-card>
</template>
<style lang="scss" scoped>
.text {
  color: #fff;
}

.fm-bg {
  background: linear-gradient(
    to right,
    #79d6f2,
    #9ff684,
    #ffd1d1,
    #c0fec0,
    #dbf489,
    #f5ea53
  ) !important;
}
.area-card {
  font-family: SourceHanSansCN;
  margin: 0 auto;
  width: 90%;
  max-width: 800px;
  margin-bottom: 40px;
  // min-height: 600px;
  border-radius: 0;
  border: solid 0.6rem /* 12/16 */ #000100;
  background-color: v-bind(themeColor);
  .logo {
    width: 20%;
    margin: -8%;
    // transform-origin: 50% 0;
    // transform: scale(0.5);
  }

  .pz-list {
    list-style: none;
    padding-left: 0;
    height: fit-content;
  }

  .pz-item {
    background-color: #fff;
    margin: 12px 0;
    padding: 12px;

    .pz-title {
      text-align: left;
    }

    .pz-ans {
      text-align: right;
      width: 50%;
    }

    // .fm-title {
    //   width: 100%;
    //   text-align: center;
    // }
  }

  .pz-solved {
    background-color: #6ba038;
  }

  :deep(.el-card__header) {
    height: fit-content;
    font-size: 2rem /* 32/16 */;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
    padding: 0;
    // padding-bottom: 8px;
    margin: 0.75rem /* 12/16 */ 0;
    // border-bottom: solid 2px #fff;
    border-bottom: none;
  }

  :deep(.el-card__body) {
    // background-color: v-bind(themeColor);
    padding: 12px 32px;

    .el-link {
      width: 98%;
    }

    .pz-solved {
      .el-link__inner {
        color: #fff;
      }
    }

    .el-link__inner {
      color: #000;
      width: inherit;
      display: flex;
      justify-content: space-between;
      font-size: 1.6rem;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.69;
      letter-spacing: normal;
      word-wrap: break-word;
    }

    .el-link.is-underline:hover:after {
      border-bottom: 4px solid v-bind(themeColor);
    }
  }
}

/* 手机字体优化 */
@media screen and (max-width: 600px) {
  .area-card {
    :deep(.el-card__body) {
      .el-link__inner {
        font-size: 1rem !important
          /* 32/16 */
        ;
      }
    }
  }
}
</style>
