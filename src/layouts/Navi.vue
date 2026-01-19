<template>
    <div class="sp-index-navi-container">
        <div class="row header-line">
            <ul class="col link-button-wrapper">
                <li>
                    <div class="hunt sp-title">
                        <img v-if="logo" class="hunt-logo" :src="`/${logo}`"></img>
                        <div class="hunt-title">
                            <h2>{{ title }}</h2>
                        </div>
                    </div>
                </li>
                <li v-for="hunt in hunts" @click="navigate(`/main/${hunt.path}`)" class="huntlink-li">
                    <div class="hunt">
                        <img v-if="hunt.logo" class="hunt-logo" :src="`/config/logos/${hunt.logo}`"></img>
                        <div class="hunt-title">
                            <h2>{{ hunt.title }}</h2>
                            <h4 v-if="hunt.subtitle">{{ hunt.subtitle }}</h4>
                        </div>
                        <div class="hunt-time">
                            <h4>{{ new Date(hunt.start).toLocaleString() }}</h4>
                            <h4>{{ new Date(hunt.end).toLocaleString() }}</h4>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="site-info-div">
            <el-tooltip class="box-item" effect="dark" content='<div style="max-width:24rem;word-break:break-all;">免责声明：<br />CCXCArchiveEvolved是本人的<a style="color:#fff" href="https://github.com/EternalIllusion/PuzzleHuntArchives">PH存档项目</a>此主要版本的框架名称。<br />此框架是为新版<a style="color:#fff" href="https://github.com/cipherpuzzles/CCBCArchive">CCBCArchive</a>所开发的。<br />框架中所使用的大部分代码来自本人于各大出题组的<a style="color:#fff" target="_blank" rel="noopener" href="https://github.com/cipherpuzzles/ccxc-puzzle">ccxc-puzzle</a>的<a style="color:#fff" href="https://github.com/cipherpuzzles/ccxc-puzzle/commit/50dc40f9816d15ed1701458f46c4b68a66fd3f1e">递交50dc40f</a>版本的(因比赛未结束等原因)暂时无法发布的改版和本人在<a style="color:#fff" target="_blank" rel="noopener" href="https://github.com/cipherpuzzles/CCBCArchive/pull/2">CCBCArchive递交的代码</a>。<br />框架仍不完善，期待您的添砖加瓦！</div>' placement='top-start' raw-content><a target="_blank" rel="noopener" class="site-info"
                    href="https://github.com/EternalIllusion/PuzzleHuntArchives">Powered by EterIll's PH Archive<br />with
                    CCXCArchiveEvolved</a></el-tooltip></div>
        </div>
        <div class="sp-index-extras">
            <a href="https://x.com/hisehisekin" class="banner-credit main-ext-icon" target="_blank" rel="noopener">
                <svg width="1em" height="1em" data-icon="material-symbols:copyright-outline-rounded"
                    class="banner-credit-icon-copyright">
                    <symbol id="ai:material-symbols:copyright-outline-rounded" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m-2-4h4q.425 0 .713-.288T15 15v-1q0-.425-.288-.712T14 13t-.712.288T13 14h-2v-4h2q0 .425.288.713T14 11t.713-.288T15 10V9q0-.425-.288-.712T14 8h-4q-.425 0-.712.288T9 9v6q0 .425.288.713T10 16">
                        </path>
                    </symbol>
                    <use href="#ai:material-symbols:copyright-outline-rounded"></use>
                </svg>
                <div class="banner-credit-text">X@hisehisekin</div>
                <svg width="1em" height="1em" data-icon="fa6-solid:arrow-up-right-from-square"
                    class="banner-credit-icon-share">
                    <symbol id="ai:fa6-solid:arrow-up-right-from-square" viewBox="0 0 512 512">
                        <path fill="currentColor"
                            d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32zM80 32C35.8 32 0 67.8 0 112v320c0 44.2 35.8 80 80 80h320c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v112c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16h112c17.7 0 32-14.3 32-32s-14.3-32-32-32z">
                        </path>
                    </symbol>
                    <use href="#ai:fa6-solid:arrow-up-right-from-square"></use>
                </svg>
            </a>

            <el-tooltip class="box-item" effect="dark" content="EternalIllusion/PuzzleHuntArchives" placement="top-end">
                <a href="https://github.com/EternalIllusion/PuzzleHuntArchives" class="banner-github main-ext-icon"
                    target="_blank" rel="noopener">
                    <svg width="0.97em" height="1em" class="icon-github" data-icon="fa6-brands:github">
                        <symbol id="ai:fa6-brands:github" viewBox="0 0 496 512">
                            <path fill="currentColor"
                                d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6c-3.3.3-5.6-1.3-5.6-3.6c0-2 2.3-3.6 5.2-3.6c3-.3 5.6 1.3 5.6 3.6m-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9c2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3m44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9c.3 2 2.9 3.3 5.9 2.6c2.9-.7 4.9-2.6 4.6-4.6c-.3-1.9-3-3.2-5.9-2.9M244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2c12.8 2.3 17.3-5.6 17.3-12.1c0-6.2-.3-40.4-.3-61.4c0 0-70 15-84.7-29.8c0 0-11.4-29.1-27.8-36.6c0 0-22.9-15.7 1.6-15.4c0 0 24.9 2 38.6 25.8c21.9 38.6 58.6 27.5 72.9 20.9c2.3-16 8.8-27.1 16-33.7c-55.9-6.2-112.3-14.3-112.3-110.5c0-27.5 7.6-41.3 23.6-58.9c-2.6-6.5-11.1-33.3 2.6-67.9c20.9-6.5 69 27 69 27c20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27c13.7 34.7 5.2 61.4 2.6 67.9c16 17.7 25.8 31.5 25.8 58.9c0 96.5-58.9 104.2-114.8 110.5c9.2 7.9 17 22.9 17 46.4c0 33.7-.3 75.4-.3 83.6c0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252C496 113.3 383.5 8 244.8 8M97.2 352.9c-1.3 1-1 3.3.7 5.2c1.6 1.6 3.9 2.3 5.2 1c1.3-1 1-3.3-.7-5.2c-1.6-1.6-3.9-2.3-5.2-1m-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9c1.6 1 3.6.7 4.3-.7c.7-1.3-.3-2.9-2.3-3.9c-2-.6-3.6-.3-4.3.7m32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2c2.3 2.3 5.2 2.6 6.5 1c1.3-1.3.7-4.3-1.3-6.2c-2.2-2.3-5.2-2.6-6.5-1m-11.4-14.7c-1.6 1-1.6 3.6 0 5.9s4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2c-1.4-2.3-4-3.3-5.6-2">
                            </path>
                        </symbol>
                        <use href="#ai:fa6-brands:github"></use>
                    </svg></a>
            </el-tooltip>
        </div>




        <div :class="{ 'loader': true, 'loading': loading }">
            <div class="loading-tip"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="">
                    <animateTransform xmlns="http://www.w3.org/2000/svg" attributeName="transform" attributeType="XML"
                        type="rotate" from="360" to="0" dur="1.0s" repeatCount="indefinite" />
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                加载中……请稍后……</div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
//import { useRoute, useRouter } from 'vue-router'

import { SiteConfig, Hunt } from '../dataschem/interfaces';
import type { AxiosResponse } from 'axios';
type SiteCfgResponse = AxiosResponse<SiteConfig>;

import { getSiteConfig } from '../api';

const hunts = reactive<Hunt[]>([]);
const loading = ref(true);

async function loadDetail() {
    console.log("site-render");

    const data = await getSiteConfig<SiteCfgResponse>();

    console.debug(data);

    if (data.data) {
        Object.assign(hunts, data.data.hunts);
        title.value = data.data.title;
        logo.value = data.data.siteLogo;
    }
}

const router = useRouter();
const navigate = (path: string) => {
    router.push(path);
}

//const route = useRoute();
//const router = useRouter();

const title = ref("EterIll's PH Archive");
const logo = ref("");

onMounted(async () => {
    await loadDetail();
    loading.value = false
});

</script>

<style>
.page-title {
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    pointer-events: none;
    transition: all ease .4s;
}


@keyframes gradientShift {
    0% {
        background-position: 250% 50%;
    }

    100% {
        background-position: 750% 50%;
    }
}

body.sp::before {
    content: "";
    background: url("/static/bg_4e65eaf7.webp") no-repeat right top / cover;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: fixed;
    z-index: -1;
    transition: all ease .3s, margin-right ease-in-out .15s;
}


body.sp::after {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -2;
    opacity: 0.15;
    background: linear-gradient(to right in hsl, hsl(0, 100%, 50%), hsl(135, 100%, 50%) 5%, hsl(225, 100%, 50%) 45%, hsl(0, 100%, 50%) 50%, hsl(135, 100%, 50%) 55%, hsl(225, 100%, 50%) 95%, hsl(360, 100%, 50%) 100%);
    background-size: 1000% 100%;
    animation: gradientShift 60s linear infinite;
    pointer-events: none;
}

.sp-index-navi-container {
    background: linear-gradient(to right, #ffffffdd 0%, #ffffffbb 30%, #ffffff44 70%);
    margin: 0;
    padding: 1rem;
    min-height: calc(100vh - 2rem);
    top: 0;
}

.sp-index-navi-container .loader::before {
    content: ' ';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 800;
    transition: backdrop-filter 1s ease;
    pointer-events: none;
}

.sp-index-navi-container .loader>.loading-tip {
    z-index: 900;
    position: relative;
    opacity: 0%;
    transition: all .8s ease;
}

.sp-index-navi-container .loader {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    pointer-events: none;
}

.sp-index-navi-container .loader.loading>.loading-tip {
    opacity: 100%;
}

.sp-index-navi-container .loader.loading::before {
    backdrop-filter: blur(15px);
    pointer-events: all;
}

.col {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0;
    margin: 0;
    list-style: none;
}

.sp-index-navi-container .link-button-wrapper li {
    list-style: none;
    margin: 0;
    padding: 0;
}

.sp-index-navi-container .hunt {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto;
    grid-template-areas:
        "logo title time";
    gap: 0 .8rem;
    padding: 1rem;
    padding-right: 50%;
    background: linear-gradient(to right, #ffffffdd 0%, #ffffffbb 30%, #ffffff33 60%, #ffffff00 65%);
    border-radius: 12px;
    align-items: center;
    min-height: 80px;
    transition: all ease .5s;
}

.sp-index-navi-container .huntlink-li {
    cursor: pointer;
}

.sp-index-navi-container .hunt-logo {
    grid-area: logo;
    width: 3rem;
    height: 3rem;
    object-fit: cover;
    border-radius: .4rem;
    background: #f8f9fa;
    justify-self: center;
    transition: all ease .5s;
}


.sp-index-navi-container .hunt-title {
    grid-area: title;
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 1.5rem;
    transition: all ease .5s;
}


.sp-index-navi-container .hunt-title h2 {
    grid-area: subtitle;
    margin: 0;
    font-size: 1.25rem;
    font-weight: 400;
    transition: all ease .5s;
}

.sp-index-navi-container .hunt-title h4 {
    grid-area: subtitle;
    margin: 0;
    font-size: 0.95rem;
    color: #333;
    font-weight: 400;
    transition: all ease .5s;
}


.sp-index-navi-container .hunt-time {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    grid-area: time;
    transition: all ease .5s;
}

.sp-index-navi-container .hunt-time h4 {
    margin: 0;
    font-size: 0.9rem;
    color: #333;
    font-weight: 500;
    white-space: nowrap;
    transition: all ease .5s;
}

@media (max-aspect-ratio: 3/2) {
    body.sp::before {
        margin-right: -40vh;
    }
}

@media (max-width: 800px) {

    .sp-index-navi-container .hunt {
        grid-template-columns: auto 1fr;
        grid-template-areas:
            "logo title"
            "time time";
        gap: 8px;
    }

    .sp-index-navi-container .hunt-time {
        grid-area: time;
        align-items: flex-start;
    }
}

.sp-index-navi-container .sp-title {
    background: none;

    .hunt-logo {
        border-radius: 0;
        background: none;
    }
}


.sp-index-navi-container .site-info {
    cursor: pointer;
    color: inherit;
    text-decoration: none;
}

.sp-index-navi-container .site-info-div {
    margin: 1rem;
    padding-top: 2rem;
}


.sp-index-extras {
    display: flex;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    gap: 1rem;
    flex-direction: row;
    flex-wrap: wrap;

    z-index: 1000;

    .main-ext-icon {
        display: flex;
        word-break: keep-all;
        text-wrap: 0;
        height: 2.25rem;
        justify-content: center;
        align-items: center;
        text-align: center;
        border-radius: 1.125rem;
        min-width: 2.25rem;
        background-color: rgba(0, 0, 0, 0.6);
        transition-property: all;
        transition-duration: 150ms;
        color: rgba(255, 255, 255, 0.75);
        text-decoration: none;

        svg {
            color: rgba(255, 255, 255, 0.75);
            align-items: center;
            justify-content: center;
            transition: opacity 150ms ease-in-out;
        }
    }

    .main-ext-icon:hover {
        background-color: rgba(0, 0, 0, 0.7);
    }

    .banner-credit {
        position: relative;
    }

    .banner-credit:hover {
        padding-right: 7.5rem;
    }

    .banner-credit-icon-copyright {
        font-size: 1.25rem;
    }

    .banner-credit-text {
        font-size: 0.75rem;
        width: 5.25rem;
        text-align: center;
        position: absolute;
        right: 2.25rem;
        opacity: 0;
    }

    .banner-credit-icon-share {
        position: absolute;
        right: 1rem;
        font-size: 0.75rem;
        opacity: 0;
    }

    .banner-credit:hover .banner-credit-icon-share,
    .banner-credit:hover .banner-credit-text {
        opacity: 1;
    }
}
</style>