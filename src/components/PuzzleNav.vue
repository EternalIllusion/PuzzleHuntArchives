<template>
  <div class="bottom-nav">
    <div>
      <el-dropdown :hide-on-click="false" @command="handleCommand">
        <h3 class="guide-menu">
          <span>导航</span>

          <el-icon class="el-icon--right">
            <ArrowUpBold />
          </el-icon>

        </h3>
        <template #dropdown>
          <el-dropdown-menu>

            <el-dropdown-item
              command="index" 
              >存档站首页</el-dropdown-item
            >
            <el-dropdown-item divided
              command="main"
              >首页</el-dropdown-item
            >
            <el-dropdown-item v-if="props.arealink"
              command="area"
              >{{ props.arealink.title }}</el-dropdown-item
            >
            <el-dropdown-item command="library" divided>
              剧情
            </el-dropdown-item>
            <el-dropdown-item
              command="announcement"
              :divided="navbarItems?.length > 0"
              >公告
            </el-dropdown-item>
            <el-dropdown-item command="scoreboard">
              排行榜
            </el-dropdown-item>
            
            <Hint :name="'HINT'" :hints="props.hints">
              <template #trigger>
                <el-dropdown-item
                  class="hidden-md-and-up"
                  command="hint"
                >
                  <span title="Help IN Theory">HINT</span>
                </el-dropdown-item>
              </template>
            </Hint>

            <Solution :analysis="props.analysis" :answer="props.answer">
              <template #trigger>
                <el-dropdown-item
                  class="hidden-md-and-up"
                  command="solution"
                >
                  解析
                </el-dropdown-item>
              </template>
            </Solution>
            
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div>
      <SubmitInput
        :answer="props.answer" :milestones="props.milestone??[]"
      />
    </div>
    <div class="nav-right hidden-sm-and-down">
      <Hint :name="'HINT'" :hints="props.hints">
        <template #trigger>
          <el-button
            type="primary"
            title="Help IN Theory"
          >
            HINT
          </el-button>
        </template>
      </Hint>

      <Solution :analysis="props.analysis" :answer="props.answer">
        <template #trigger>
          <el-button type="primary">
            解析
          </el-button>
        </template>
      </Solution>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { AdditionalAnswer,NavBarItem,PuzzleTip,Link } from "../dataschem/interfaces";
const props = defineProps<{
  themeColor?: string;
  themeColorText?: string;
  hunt: string;
  pgid: string;
  pid: string;
  answer: string;
  milestone?: AdditionalAnswer[];
  analysis: string;
  hints: PuzzleTip[];
  arealink?:Link|null;
}>();

import { ArrowUpBold } from "@element-plus/icons-vue";
import router from "../router";
import "element-plus/theme-chalk/display.css";

const navbarItems = reactive<NavBarItem[]>([]);

const handleCommand = (command: string | number | { path?: string }) => {
  console.log(command);
  switch (command) {
    case "announcement":   
      window.open(`${window.location.origin}/announcements/${props.hunt}`);
      break;
    default:
      const path = (command as { path: string }).path;
      if (path) {
        if (path[0] == "/") {
          router.push((command as { path: string }).path);
        } else {
          window.open(path);
        }
      }
      console.log(command);
  }
};

const emits = defineEmits(["puzzle-reload"]);

</script>



<style lang="scss" scoped>
.bottom-nav {
  background-color: var(--nav-bg-color);
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 12vw;
  height: 80px;
  z-index: 500;
  :deep(.el-dropdown) {
    color: var(--nav-text-color);
  }
  .guide-menu {
    user-select: none;
    cursor: pointer;
  }
  .nav-right {
    display: flex;
    gap: 20px;
  }
}
/* 手机字体优化 */
@media screen and (max-width: 600px) {
  .bottom-nav {
    padding: 0 6px;
  }
  .el-icon--right {
    font-size: 8px;
  }
}


</style>
