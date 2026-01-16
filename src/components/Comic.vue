<script lang="ts" setup>
defineProps<{ images: string[] }>();
// const imgList = ref(props.images);
// watch(
//   () => props.images,
//   (newVal) => {
//     console.info(newVal);
//     imgList.value = newVal;
//   },
//   {
//     deep: true,
//   }
// );
</script>
<template>
  <!-- <el-carousel
    class="comic-container"
    indicator-position="outside"
    :loop="false"
    height="auto"
  >
    <el-carousel-item v-for="(img, index) in images" :key="index">
      <el-image :src="img" alt="comic" class="comic" fit="contain" :preview-src-list="[img]" />
    </el-carousel-item>
  </el-carousel> -->
  <div class="comic-container">
    <el-image
      v-for="img in images"
      :src="img"
      alt="comic"
      class="comic"
      fit="contain"
      :preview-src-list="[img]"
    />
  </div>
</template>
<style lang="scss" scoped>
.comic-container {
  display: flex;
  width: 400px;
}
.comic {
  height: 800px;
}
// :deep(.el-carousel__item) {
//   text-align: center;
// }
</style>
