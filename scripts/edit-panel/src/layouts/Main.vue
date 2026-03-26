<template>
    <div class="container">
        <div class="sp-index-navi-container">
            <div class="row header-line">
                <ul class="col link-button-wrapper">
                    <li>
                        <div class="edit sp-title">
                            <div class="edit-title">
                                <h2>Archive Editor</h2>
                            </div>
                        </div>
                    </li>
                    <li v-if="isLoggedIn" @click="navigate(`/editor`)" class="editlink-li">
                        <div class="edit">
                            <div class="edit-title">
                                <h2>开始编辑</h2>
                                <h4>编辑存档站的内容</h4>
                            </div>
                        </div>
                    </li>
                    <li v-if="isLoggedIn" @click="logout" class="editlink-li">
                        <div class="edit">
                            <div class="edit-title">
                                <h2>退出登录</h2>
                            </div>
                        </div>
                    </li>
                    <li v-else @click="navigate(`/login`)" class="editlink-li">
                        <div class="edit">
                            <div class="edit-title">
                                <h2>登录</h2>
                                <h4>前往登录</h4>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="site-info-div">
                    <a target="_blank" rel="noopener" class="site-info"
                        href="https://github.com/EternalIllusion/PuzzlehuntArchives">Powered by EterIll's PH
                        Archive<br />with
                        CCXCArchiveEvolved</a>
                </div>
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
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();

const isLoggedIn = computed(() => { return userStore.isLoggedIn });

const router = useRouter();
const navigate = (path: string) => {
    router.push(path);
}

const logout = () => {
    userStore.logout();
}
</script>

<style scoped>
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

.container::before {
    content: "";
    background: url("https://ph.eterill.xyz/static/bg_4e65eaf7.webp") no-repeat right top / cover;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: fixed;
    z-index: -1;
    transition: all ease .3s, margin-right ease-in-out .15s;
}


.container::after {
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
    display: flex;
    flex-direction: column;
    gap: 1rem;
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

.sp-index-navi-container .edit {
    display: flex;
    flex-direction: column;
    justify-content: left;
    align-items: center;
    gap: 0 .8rem;
    padding: 1rem;
    padding-right: 50%;
    background: linear-gradient(to right, #ffffffdd 0%, #ffffffbb 30%, #ffffff33 60%, #ffffff00 65%);
    border-radius: 12px;
    transition: all ease .5s;
}

.sp-index-navi-container .editlink-li {
    cursor: pointer;
}


.sp-index-navi-container .edit-title {
    display: flex;
    flex-direction: column;
    height: min-content;
    margin: 0;
    width: 100%;
    font-size: 1.2rem;
    font-weight: 600;
    color: #1a1a1a;
    transition: all ease .5s;
}


.sp-index-navi-container .edit-title h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 400;
    transition: all ease .5s;
}

.sp-index-navi-container .edit-title h4 {
    margin: 0;
    font-size: 0.95rem;
    color: #333;
    font-weight: 400;
    transition: all ease .5s;
}

@media (max-aspect-ratio: 3/2) {
    .container::before {
        margin-right: -40vh;
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