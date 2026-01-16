<script setup lang="ts">
import { useRoute } from "vue-router";
import { useTheme } from "../dataschem/theme";
import { Area, AreaMapCfg } from "../dataschem/interfaces";
const theme = useTheme();
const route = useRoute();

async function loadMainInfo() {
  await theme.update(route.params.hunt as string);
  Object.assign(mapcfg, {});
  console.debug(mapcfg);
  Object.assign(mapcfg,theme.maps[route.params.pgid as string]);
  console.debug(mapcfg);
  updateMapScale();
}

onMounted(() => {
  updateMapScale();
  window.addEventListener("resize", updateMapScale);
});

onBeforeMount(async ()=>{
  await loadMainInfo();
})

onUnmounted(() => {
  window.removeEventListener("resize", updateMapScale);
});

const mapcfg = reactive<AreaMapCfg>({originalHeight:1,originalWidth:1,mapItem:[]});
//console.debug(theme.maps,theme.maps[route.params.pgid as string]);
const table = ref<null|HTMLElement>(null);
const mapScale = ref(1.000000);
const mapHeightRaw = ref(mapcfg.originalHeight);
const mapHeight = computed(()=>{return `${mapHeightRaw}px`});
const mapWidth = ref(1);

const data = reactive<Area>({title:"",problems:[]});

const updateMapScale = () => {
  nextTick(() => {
    let originHeight = mapcfg.originalHeight;
    let originWidth = mapcfg.originalWidth;

    const mapContainer = table.value;
    if (mapContainer) {
      mapWidth.value = mapContainer.offsetWidth;
      mapScale.value = mapWidth.value / originWidth;
      mapHeightRaw.value = originHeight * mapScale.value;
      console.log(`${originWidth} x ${originHeight} -> ${mapWidth.value} x ${mapHeightRaw.value} (${mapScale.value.toFixed(2)}x)`);
      //console.debug(mapHeight,mapWidth,mapScale)
    }

  });
};

</script>

<template>
  <div class="main-container" ref="table">
    <div class="pz-map" :style="{height:`${mapHeight}px`,width:`${mapWidth}px`,minHeight:`${mapHeight}px`,minWidth:`${mapWidth}px`}">
        <PuzzleMap
          :pgid="route.params.pgid as string"
          :hunt="route.params.hunt as string"
          :config="mapcfg"
          :map-scale="mapScale"
          :map-height="mapHeightRaw"
          :map-width="mapWidth"
          :items="data"
        />
      </div>
      <div class="pz-list">
        <PuzzleList
          :logo="mapcfg.logo"
          :pgid="route.params.pgid as string"
          :hunt="route.params.hunt as string"
          :theme-color="'#0037b8'"
          @puzzle-render="(res)=>{Object.assign(data,res)}"
        />
      </div>

  </div>
  <Nav />
</template>

<style lang="scss" scoped>
.main-container {
  background: var(--pz-bg-color-1);
  box-sizing: border-box;
  padding-top: 40px;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;

  #table {
    height: v-bind(mapHeight);
    transform-origin: left top;
    /* 设置变换原点为左上角 */
    transform: scale(v-bind(mapScale));

    /* 缩放 */
    .puzzle {
      position: absolute;
    }
  }
}
</style>



