<template>
    <div class="container-md">
        <div class="title">
            <h1>{{ data.title }}</h1>
        </div>
        <div class="desc">
            <div v-html="desc" id="contentHtml"></div>
        </div>
        <div class="annocards">
                <div class="anno-card" v-for="anno in annoList" :key="anno.aid">
                    <div class="anno-card-time">发布于：{{ formatTimestamp(anno.create_time) }}</div>
                    <div class="anno-card-time-updated" v-if="anno.update_time!==anno.create_time">最后修改于：{{formatTimestamp(anno.update_time) }}</div>
                    <div v-html="anno.html"></div>
                </div>
        </div>
    </div>
    <Nav />
</template>

<style lang="scss" scoped>
.title {
    align-items: center;
    justify-content: center;
    text-align: center;
}

.desc {
    margin: .75rem 1.5rem;
    padding: 1.5rem;
    position: relative;
}

.annocards {
    display: flex;
    flex-direction: column;
}

.anno-card {
    margin: .75rem 1.5rem;
    padding: 1.5rem;
    padding-top: 2rem;
    border-radius: .8rem;
    min-height: 200px;
    background-color: #f0f0f0;
    position: relative;
}
.anno-card-time {
    color: #8a8a8a;
    position: absolute;
    top:.5rem;
    right: .5rem;
    font-size: .8rem;
}
.anno-card-time-updated {
    color: #8a8a8a;
    position: absolute;
    top:1.5rem;
    right: .5rem;
    font-size: .8rem;
}
</style>

<script setup lang="ts">
import { Ref } from 'vue';
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { markdownToHtml } from '../utils';
import { getAnno } from '../api';
import { formatTimestamp } from '../utils/formatDate';

import { Announcement, Announcements } from '../dataschem/interfaces';
import Nav from '../components/Nav.vue';

const route = useRoute();

const desc: Ref<string> = ref("");
const data = reactive<Announcements>({type:"",title:"",content:"",announcements:[]});

const annoList: Ref<AnnoInfo[]> = ref([]);

interface AnnoInfo extends Announcement {
    html:string;
}

onMounted(async () => {
    const conf = await getAnno(route.params.hunt as string);
    Object.assign(data,conf);

    desc.value = markdownToHtml(data.content);
    annoList.value = data.announcements.map(anno => {
        return {
            html: markdownToHtml(anno.content),
            ...anno
        }
    });
});

</script>