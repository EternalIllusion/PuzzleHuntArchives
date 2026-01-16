<script lang="ts" setup>
import { Area, AreaMapCfg, MapCfg } from "../dataschem/interfaces";

const props = defineProps<{
  hunt: string;
  pgid: string;
  config: AreaMapCfg;
  showPortal?: boolean;
  mapScale: number;
  mapHeight: number;
  mapWidth: number;
  items?: Area;
}>();

const pzList = reactive<MapCfg[]>(props.config.mapItem);

const emits = defineEmits(["pz-click"]);


//onBeforeMount(()=>{console.debug(props)})

watch(
  () => props.config.mapItem,
  () => {
    console.log(props.config.mapItem);
    Object.assign(pzList, props.config.mapItem);
  }
);

</script>
<template>
  <div :style="{ width: props.mapWidth + 'px' }">
    <div class="map-container" :style="{ height: mapHeight + 'px' }">
      <el-image v-if="props.config.bg" class="map-bg" alt="bg" :src="props.config.bg" />
      <el-image v-if="props.config.front" class="map-front" alt="front" :src="props.config.front" />
      <PuzzleItem v-for="item in pzList" :props="item" :scale="props.mapScale" :area="props.items"/>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.portal-container {
  display: flex;
  justify-items: center;
  justify-content: center;
  min-height: 200px;
}

.map-container {
  position: relative;
  width: inherit;
  // justify-content: center;
  // align-items: center;
}

.map-bg {
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
}

.map-front {
  user-select: none;
  pointer-events: none;
  position: absolute;
  top: 40px;
  left: 50%;
  z-index: 10000;
  transform: translate(-50%) scale(1.31);
}
</style>
