<script lang="ts" setup>
import { ArrowLeftBold } from "@element-plus/icons-vue";
const route = useRoute();
const router = useRouter();

const btnVisible = computed(() => {
  console.debug("path:",route.path);
  return (
    route.path !== '/'
  );
});

const back = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
}
</script>
<template>
  <div
    v-if="btnVisible"
    title="返回"
    class="back-btn"
    @click="back()"
  >
    <ArrowLeftBold />
  </div>
</template>
<style scoped>
.back-btn {
  position: fixed;
  top: 1rem;
  left: 1rem;
  width: 1rem;
  height: 1rem;
  color: var(--pz-text-color,#000);
  z-index: 100000;
  background-size: 100%;
  cursor: pointer;
  transition: all ease .5s;
}
.back-btn:hover {
  color: var(--nav-bg-color,#666);
}
/* 手机字体优化 */
@media screen and (max-width: 600px) {
  .back-btn {
    scale: 1.2;
    top: 0;
    left: 0;
  }
}
</style>
