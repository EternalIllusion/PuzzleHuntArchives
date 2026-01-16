<script setup lang="ts">
const needReload = ref(false);
provide("need-reload", needReload);

const themeColor = ref("#000000");
provide("theme-color", themeColor);

import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.meta.hasSpecialStyle,
  (hasSpecial) => {
    if (hasSpecial) {
      document.body.classList.add('sp')
    } else {
      document.body.classList.remove('sp')
    }
  },
  { immediate: true }
)

watch(
  () => route.meta.hasSpecialCustomStyle,
  (hasSpecial) => {
    if (hasSpecial) {
      document.body.classList.add('sp-c')
    } else {
      document.body.classList.remove('sp-c')
    }
  },
  { immediate: true }
)

</script>

<template>
  <Back />
  <router-view />
  <!--Nav
    v-if="$route.path.indexOf('tieba') == -1"
    @puzzle-reload="needReload = true"
  /-->
</template>
