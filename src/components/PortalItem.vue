<script lang="ts" setup>
import router from "../router";
import img1 from "/src/assets/c15/portals/P1.png";
import img2 from "/src/assets/c15/portals/P2.png";
import img3 from "/src/assets/c15/portals/P3.png";
import img4 from "/src/assets/c15/portals/P4.png";
import img5 from "/src/assets/c15/portals/P5.png";
import img6 from "/src/assets/c15/portals/P6.png";

export interface PortalProps {
  portalId: number;
  title: string;
  index: number;
  portalCount: number;
}
defineProps<{ props: PortalProps }>();

const portalImgList = new Map([
  [2, img1],
  [3, img2],
  [4, img3],
  [5, img4],
  [6, img5],
  [7, img6],
]);

const portalColorList = new Map([
  [2, "#f66484"],
  [3, "#208844"],
  [4, "#3a2104"],
  [5, "#007dbf"],
  [6, "#5f4bcb"],
  [7, "#aa3719"],
]);

const path = new Map([
  [2, "/c101/"],
  [3, "/c12(1)/"],
  [4, "/c9~/"],
  [5, "/tieba/"],
  [6, "/cat/"],
  [7, "/c15t/"],
]);

const handlePortalClick = (path?: string) => {
  if (path == undefined) return;
  router.push(path);
};
</script>
<template>
  <div
    v-if="path.has(props.portalId)"
    class="portal-item-container"
    :style="{
      'margin-top': `${
        Math.abs(props.index - props.portalCount / 2 + 0.5) * 40
      }px`,
    }"
    @click="handlePortalClick(path.get(props.portalId))"
  >
    <img
      class="portal"
      :src="portalImgList.get(props.portalId)"
      :alt="props.title"
    />
    <el-button
      class="portal-btn"
      :style="{
        'background-color': portalColorList.get(props.portalId),
      }"
    >
      {{ props.title }}</el-button
    >
  </div>
</template>
<style lang="scss" scoped>
.portal-item-container:hover {
  .portal {
    filter: drop-shadow(0 0 0.5rem #fff);
    margin-top: -10px;
    padding-bottom: 10px;
  }

  .portal-btn {
    opacity: 1;
  }

  cursor: pointer;
}

.portal-item-container {
  position: relative;
  width: max-content;
  height: max-content;

  .portal {
    user-select: none;
    margin: 0 20px;
    margin-top: 0;
    padding-bottom: 0;
    transition: all 0.4s ease-in-out;
  }

  .portal-btn {
    position: absolute;
    max-width: 200px;
    height: max-content;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem /* 14/16 */;
    font-weight: bold;
    border-radius: 4px;
    border: none;
    color: #fff;
    opacity: 0;
    transition: opacity 0.4s ease-in-out;
  }
  :deep(.el-button) {
    span {
      width: max-content;
      white-space: normal;
      word-wrap: break-word;
    }
  }
}
</style>
