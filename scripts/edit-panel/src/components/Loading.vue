<script setup lang="ts">
const props = defineProps({
  loading: {
    type: Boolean,
    required: true,
    default: 0
  }
})
</script>

<template>
  <div class="loader-container">
  <div :class="{ 'loader-mask': true, 'hidden': !loading }"></div>
  <div :class="{ 'loader': true, 'hidden': !loading }">
    <div class="la">
      <div class="la-i">
        <i class="cl aa a"></i>
        <i class="cl ab b"></i>
        <i class="cl ac c"></i>
        <i class="cl ad d"></i>
      </div>
    </div>
    <div class="lb">
      <i class="cs ba a"></i>
      <i class="cs bb b"></i>
      <i class="cs bc c"></i>
      <i class="cs bd d"></i>
    </div>
  </div></div>
</template>

<style scoped>
@media (max-width:420px) {
  .card {
    padding: 20px
  }

  .btn {
    padding: 10px 14px
  }
}

@keyframes la {
  0% {
    transform: rotate(0deg);
  }

  4% {
    transform: rotate(-15deg);
  }

  20% {
    transform: rotate(-105deg);
  }

  28% {
    transform: rotate(-90deg);
  }

  100% {
    transform: rotate(-90deg);
  }
}

@keyframes lb {
  0% {
    transform: rotate(0deg);
  }

  4% {
    transform: rotate(-15deg);
  }

  20% {
    transform: rotate(-105deg);
  }

  28% {
    transform: rotate(-90deg);
  }

  56% {
    transform: rotate(-90deg);
  }

  64% {
    transform: rotate(-180deg);
  }

  100% {
    transform: rotate(-180deg);
  }
}

@keyframes aa {
  0% {
    background-color: rgba(255, 255, 255, 0);
  }

  4% {
    background-color: rgba(255, 255, 255, 100%);
  }

  8% {
    background-color: rgba(255, 255, 255, 0);
  }

  40% {
    background-color: rgba(255, 255, 255, 0);
  }

  44% {
    background-color: rgba(255, 255, 255, 100%);
  }

  48% {
    background-color: rgba(255, 255, 255, 0);
  }

  100% {
    background-color: rgba(255, 255, 255, 0);
  }
}

@keyframes ba {
  0% {
    background-color: rgba(255, 255, 255, 0);
  }

  4% {
    background-color: rgba(255, 255, 255, 0);
  }

  8% {
    background-color: rgba(255, 255, 255, 100%);
  }

  12% {
    background-color: rgba(255, 255, 255, 0);
  }

  48% {
    background-color: rgba(255, 255, 255, 0);
  }

  52% {
    background-color: rgba(255, 255, 255, 100%);
  }

  56% {
    background-color: rgba(255, 255, 255, 0);
  }

  100% {
    background-color: rgba(255, 255, 255, 0);
  }
}

@keyframes ab {
  0% {
    background-color: rgba(255, 255, 255, 0);
  }

  36% {
    background-color: rgba(255, 255, 255, 0);
  }

  40% {
    background-color: rgba(255, 255, 255, 100%);
  }

  44% {
    background-color: rgba(255, 255, 255, 0);
  }

  100% {
    background-color: rgba(255, 255, 255, 0);
  }
}

@keyframes bb {
  0% {
    background-color: rgba(255, 255, 255, 0);
  }

  40% {
    background-color: rgba(255, 255, 255, 0);
  }

  44% {
    background-color: rgba(255, 255, 255, 100%);
  }

  48% {
    background-color: rgba(255, 255, 255, 0);
  }

  100% {
    background-color: rgba(255, 255, 255, 0);
  }
}

@keyframes ac {
  0% {
    background-color: rgba(255, 255, 255, 0);
  }

  8% {
    background-color: rgba(255, 255, 255, 100%);
  }

  12% {
    background-color: rgba(255, 255, 255, 0);
  }

  16% {
    background-color: rgba(255, 255, 255, 0);
  }

  52% {
    background-color: rgba(255, 255, 255, 0);
  }

  56% {
    background-color: rgba(255, 255, 255, 100%);
  }

  60% {
    background-color: rgba(255, 255, 255, 0);
  }

  100% {
    background-color: rgba(255, 255, 255, 0);
  }
}

@keyframes bc {
  0% {
    background-color: rgba(255, 255, 255, 0);
  }

  12% {
    background-color: rgba(255, 255, 255, 0);
  }

  16% {
    background-color: rgba(255, 255, 255, 100%);
  }

  20% {
    background-color: rgba(255, 255, 255, 0);
  }

  56% {
    background-color: rgba(255, 255, 255, 0);
  }

  60% {
    background-color: rgba(255, 255, 255, 100%);
  }

  64% {
    background-color: rgba(255, 255, 255, 0);
  }

  100% {
    background-color: rgba(255, 255, 255, 0);
  }
}

@keyframes ad {
  0% {
    background-color: rgba(255, 255, 255, 0);
  }

  16% {
    background-color: rgba(255, 255, 255, 100%);
  }

  20% {
    background-color: rgba(255, 255, 255, 0);
  }

  24% {
    background-color: rgba(255, 255, 255, 0);
  }

  60% {
    background-color: rgba(255, 255, 255, 0);
  }

  64% {
    background-color: rgba(255, 255, 255, 100%);
  }

  68% {
    background-color: rgba(255, 255, 255, 0);
  }

  100% {
    background-color: rgba(255, 255, 255, 0);
  }
}

@keyframes bd {
  0% {
    background-color: rgba(255, 255, 255, 0);
  }

  20% {
    background-color: rgba(255, 255, 255, 0);
  }

  24% {
    background-color: rgba(255, 255, 255, 100%);
  }

  28% {
    background-color: rgba(255, 255, 255, 0);
  }

  100% {
    background-color: rgba(255, 255, 255, 0);
  }
}

.loader-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.loader {
  --anim: 3s;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 8rem;
  height: 8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all ease .5s;
  z-index: 9999;

  .la,
  .lb {
    position: absolute;
  }

  .cl,
  .cs {
    position: absolute;
    border-radius: 50%;
    border: #fff .1rem solid;
  }

  .cl {
    width: 1rem;
    height: 1rem;
  }

  .cs {
    width: .5rem;
    height: .5rem;
  }

  .la {
    animation: la linear infinite running var(--anim);
  }

  .la-i {
    width: 6rem;
    height: 6rem;
    transform: rotate(45deg);
    transition: all ease .5s;

    .aa {
      animation: aa linear infinite running var(--anim);
    }

    .ab {
      animation: ab linear infinite running var(--anim);
    }

    .ac {
      animation: ac linear infinite running var(--anim);
    }

    .ad {
      animation: ad linear infinite running var(--anim);
    }
  }

  .lb {
    width: 4.8rem;
    height: 4.8rem;
    animation: lb linear infinite running var(--anim);
    transition: all ease .5s;

    .ba {
      animation: ba linear infinite running var(--anim);
    }

    .bb {
      animation: bb linear infinite running var(--anim);
    }

    .bc {
      animation: bc linear infinite running var(--anim);
    }

    .bd {
      animation: bd linear infinite running var(--anim);
    }
  }

  .a {
    top: 0;
    left: 0;
  }

  .b {
    top: 0;
    right: 0;
  }

  .c {
    bottom: 0;
    left: 0;
  }

  .d {
    bottom: 0;
    right: 0;
  }
}

.loader-mask {
  position: absolute;
  z-index: 1001;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.64);
  transition: all ease 1s;
}

.loader-mask.hidden {
  backdrop-filter: blur(0);
  background-color: rgba(0, 0, 0, 0);
  pointer-events: none;
}

.loader.hidden {
  opacity: 0;
  pointer-events: none;

  .la-i {
    width: 5rem;
    height: 5rem;
  }

  .lb {
    width: 3rem;
    height: 3rem;
  }
}
</style>