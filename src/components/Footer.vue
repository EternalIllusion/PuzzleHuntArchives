<template>
  <div class="nav-footer hidden-sm-and-down">
    <span>Copyright ©2020-2024 密码菌 All rights reserved.</span>
    <span>没ICP备2025114514号-1</span>
  </div>
  <div class="nav-footer-sm hidden-md-and-up">
    <span>Copyright ©2020-2024 密码菌 All rights reserved.</span>
    <span>没ICP备2025114514号-1</span>
  </div>
</template>

<script setup lang="ts">
import "element-plus/theme-chalk/display.css";


</script>

<style lang="scss" scoped>
.nav-footer {
  background-color: var(--el-bg-color-footer);
  color: var(--el-text-color-footer);
  display: flex;
  gap: 2em;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 124px;
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.69;
  letter-spacing: normal;
}
.nav-footer-sm {
  background-color: var(--el-bg-color-footer);
  color: var(--el-text-color-footer);
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 124px;
  font-size: 14px;
  text-align: center;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.69;
  letter-spacing: normal;
}
</style>
