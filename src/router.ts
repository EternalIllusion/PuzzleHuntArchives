import { createRouter, createWebHashHistory } from 'vue-router'

import Index from './views/Index.vue'
import Page from './views/Page.vue'
import Problem from './views/Problem.vue'
import Scoreboard from './views/Scoreboard.vue'
import Announcements from './views/Announcements.vue'
import Readme from './views/Readme.vue'

const routes = [
    {
        path: '/',
        component: Readme
    },
    {
        path: '/index',
        component: Index
    },
    {
        path: '/page',
        component: Page
    },
    {
        path: '/problem',
        component: Problem
    },
    {
        path: '/scoreboard',
        component: Scoreboard
    },
    {
        path: '/announcements',
        component: Announcements
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;