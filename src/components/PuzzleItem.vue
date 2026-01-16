<script lang="ts" setup>
import { Area, MapCfg, Problem } from '../dataschem/interfaces';
import { badge } from '../utils';
import { adjustTextColor } from '../utils';

const params = defineProps<{ props: MapCfg, scale: number, area?: Area }>(); //props.scale:缩放比例

const offsetX = ref((params.props.titleOffsetX ?? 0) + "px");
const offsetY = ref((params.props.titleOffsetY ?? 0) + "px");
const imgRef = ref<HTMLImageElement | null>(null);

const imgNaturalWidth = ref(0);
const imgNaturalHeight = ref(0);

// 改为依赖响应式 ref
const imgHeight = computed(() => imgNaturalHeight.value * (params.scale ?? 1));
const imgWidth = computed(() => imgNaturalWidth.value * (params.scale ?? 1));

// 图片加载完成时更新尺寸
const onImageLoad = () => {
  if (imgRef.value) {
    imgNaturalWidth.value = imgRef.value.naturalWidth;
    imgNaturalHeight.value = imgRef.value.naturalHeight;
  }
};

onBeforeMount(() => { console.debug(params.props) })

const router = useRouter();
const handlePuzzleClick = (pid:string) => {
  const item = (params.area?.problems.find((p) => {return p.pid.toString() === pid.toString();}) ?? { title: "???", path: "/404", type: 0, pid: '-1' } as Problem);
  router.push(item.path);
}

</script>
<template>
  <div class="puzzle-item-container" :style="{ top: props.top, left: props.left }">
    <div class="icon">
      <img :src="props.imgUrl" :alt="props.title" :style="{}" ref="imgRef" :width="imgWidth" :height="imgHeight"
        @click="handlePuzzleClick(props.pid)" @load="onImageLoad" />
      <div class="pz-btn" :style="{
        'background-color': props.color,
        'transform': `translate(-50%, -50%) scale(${params.scale * 3})`
      }">
        <span class="badge" v-if="badge(props.puzzle_type)" :style="{color:adjustTextColor(props.color)}">{{ badge(props.puzzle_type) }}</span>
        <span align="center" style="display: flex;justify-content: center;align-items: center;text-align: center;" :style="{color:adjustTextColor(props.color)}">{{(area?.problems.find((p) => {return p.pid.toString() === params.props.pid.toString();}) ?? { title: "???", path: "", type: 0, pid: '-1' } as Problem).title }}</span></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.puzzle-item-container:hover {
  z-index: 9999;

  .icon {
    filter: drop-shadow(0 0 0.5rem #fff);
    // top: -6px;
  }

  .pz-btn {
    // display: block;
    opacity: 1;
  }

  user-select: none;
  cursor: pointer;
}

.puzzle-item-container {
  z-index: 99;
  position: relative;
  width: max-content;
  height: max-content;

  .icon {
    position: absolute;
    // top: 0;
    // transition: top 0.2s ease-in-out;
  }

  .pz-btn {
    position: absolute;
    height: max-content;
    min-width: max-content;
    top: calc(50% + v-bind(offsetX));
    left: calc(50% + v-bind(offsetY));
    padding: .6rem;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 4px;
    border: none;
    color: #fff;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    pointer-events: none;
  }

  .badge{
    font-size: .75rem;
    margin-right: .25rem;
  }

  // .pz-btn:hover {
  //   opacity: 1;
  // }

  :deep(.el-button) {
    span {
      width: max-content;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}

/* 手机字体优化 */
@media screen and (max-width: 600px) {
  .pz-btn {
    font-size: 1.4rem !important
      /* 32/16 */
    ;
  }
}
</style>
