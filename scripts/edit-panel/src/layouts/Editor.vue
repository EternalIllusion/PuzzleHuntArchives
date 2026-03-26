
<script setup lang="ts">
import navigator from '../components/navigator.vue';
import Loading from '../components/Loading.vue';
import { ref } from 'vue';

const pageLoading = ref < boolean > (false);
const loading = ref < boolean > (false);
</script>

<template>
    <Loading :loading="pageLoading" />
    <div class="page-container">
        <navigator />
    </div>
</template>

<style scoped>
.page-container {
    padding: 1rem;
}
</style>