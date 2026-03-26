<template>
    <div class="navigator">
    <div class="breadcrumb">
        <span class="breadcrumb-item" @click="breadcrumbNavigate(0)">root/</span>
        <span class="breadcrumb-item" v-for="(path, i) in pathdir" @click="breadcrumbNavigate(i + 1)">{{ path }}/</span>
        <div class="fold" @click="isDirExpanding=!isDirExpanding"><StretchHorizontal /></div>
    </div>
    <div :class='{"navigation":true,"folding":!isDirExpanding}'>
        <div class="loading-container"><Loading :loading="isDirExpanding && loading" /></div>
        <div class="navigation-item" v-for="dir in dirs" @click="navigate(dir)">{{ dir }}</div>
    </div></div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { readDir } from '../api';
import { StretchHorizontal } from 'lucide-vue-next';
import Loading from './Loading.vue';

const path = defineModel('path');
const emit = defineEmits(["chosenFile","chosenDir"])
const loading = ref<boolean>(false);
const isDirEmpty = ref<boolean>(false);
const isDirExpanding = ref<boolean>(true);
const pathdir = ref<Array<string>>([]);
const dirs = ref<Array<string>>([]);


const breadcrumbNavigate = (i: number) => {
    pathdir.value = pathdir.value.slice(0, i)
    loadDir(pathdir.value.join("/"))
}

const navigate = (dir?: string) => {
    if(loading.value) return;
    if (dir?.endsWith("/")) {
        pathdir.value = [...pathdir.value, dir.slice(0, -1)]
        path.value = pathdir.value.join("/");
        emit("chosenDir",path.value)
    }else{
        path.value = `${pathdir.value.join("/")}${dir}`;
        emit("chosenFile",path.value)
    }
    loadDir(pathdir.value.join("/"))
}

const loadDir = async (path?: string) => {
    loading.value = true;
    let dir = await readDir(path ? path : ".")
    if (!dir) { isDirEmpty.value = true; dirs.value = [] }
    else { dirs.value = dir }
    loading.value = false;
}

onMounted(() => {
    loadDir()
})
</script>

<style scoped>
* {
    transition: all ease .5s;
}
.navigator {
    background-color: #ecfdf5;
    border-radius: .4rem;
    padding: .1rem;

}
.breadcrumb {
    display: flex;
    position: relative;
    flex-grow: 1;
    flex-direction: row;
    gap: 0;
    justify-content: left;
    align-items: center;
    flex-wrap: wrap;
    background-color: #a7f3d0;
    border-radius: .4rem;
    padding: .1rem .5rem;
    padding-right: 2.4rem;

    .breadcrumb-item {
        display: inline-flex;
        justify-content: left;
        align-items: center;
        padding: .2rem;
        border-radius: .5rem;
        cursor: pointer;
    }

    .breadcrumb-item:hover, .fold:hover {
        background-color: #6ee7b7;
    }

    .fold {
        display: flex;
        align-items: center;
        position: absolute;
        right:.2rem;
        width: 2rem;
        height: 2rem;
        border-radius: .5rem;
        color: #10b981;
        cursor: pointer;
        svg {
        width: 2rem;
        height: 2rem;
        object-fit: cover;
        }
    }
}
.navigation {
    display: flex;
    flex-direction: column;
    position: relative;
    flex-grow: 1;
    gap: 0;
    justify-content: left;
    align-items: center;
    background-color: #ecfdf5;
    border-radius: .4rem;
    padding: .1rem;
    height: 20vh;
    overflow-y: scroll;

    .navigation-item {
        display: inline-flex;
        width: 100%;
        box-sizing: border-box;
        justify-content: left;
        align-items: center;
        text-align: left;
        padding: .2rem .5rem;
        border-radius: .5rem;
        cursor: pointer;
    }

    .loading-container{
        position: absolute;
        top:0;
        bottom: 0;
        left: 0;
        right: 0;
        pointer-events: none;
    }

    .navigation-item:hover {
        background-color: #d1fae5;
    }
}
.navigation.folding {
    height: 0;
}
</style>