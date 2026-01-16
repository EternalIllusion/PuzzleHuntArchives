<template>
  <div class="bottom-nav">
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
            <el-dropdown-item v-for="nav in props?.nav??[]"
              :command="`custom-${nav.path}`"
              >{{ nav.title }}</el-dropdown-item
            >
            
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    <div class="about"><span>EterIll's PH Archive&nbsp;|</span><span>&nbsp;Powered by CCXCArchiveEvolved</span></div>
  </div>
</template>

<script lang="ts" setup>
import { Link } from '../dataschem/interfaces';
import { ArrowUpBold } from '@element-plus/icons-vue';
const props = defineProps<{
  nav?: Link[];
}>();
const emit = defineEmits(["navclick"]);
const router = useRouter();
const route = useRoute();

const handleCommand = (command: string | number | { path?: string }) => {
  console.log(command);
  switch (command) {
    case "index":   
      router.push('/')
      break;
    case "main":
      router.push(`/main/${route.params.hunt as string}`);
      break;
    default:
      if((command as string).startsWith("custom")){
      let emtext = (command as string).slice(7);
      console.log(emtext);
      emit("navclick",emtext);
    }
  }
};

</script>
<style scoped>
.bottom-nav {
  background-color: var(--nav-bg-color,#000);
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 12vw;
  height: 5rem;
  z-index: 500;
  color: #eee;
  transition: all ease .5s;
  .about{
    align-content: center;
    font-size: .8rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    transition: all ease .5s, width .1s;
    span {
      display: flex;
      transition: all ease .5s, width .1s;
    }
    
  }
  .guide-menu {
    user-select: none;
    cursor: pointer;
    align-content: center;
    text-align: center;
    align-items: center;
    justify-content: center;
    min-width: 3.2rem;
  }
  .nav-right {
    display: flex;
    gap: 20px;
  }
}
/* 手机字体优化 */
@media screen and (max-width: 800px) {
  .bottom-nav {
    padding: 0 1rem;
  }
  .el-icon--right {
    font-size: 8px;
  }
}

@media screen and (max-width: 300px) {
  .about {
    opacity: 0;
    position: fixed;
    right: 1rem;
  }
}


</style>
