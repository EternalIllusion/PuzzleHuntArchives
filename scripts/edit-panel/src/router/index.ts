import { createRouter, createWebHashHistory } from "vue-router";

import NotFound from '../layouts/NotFound.vue';
import Main from '../layouts/Main.vue'
import Login from "../layouts/Login.vue";
import Test from "../layouts/Test.vue";
import Editor from "../layouts/Editor.vue";

const routes = [
  { path: "/", component: Main, meta: { hasSpecialStyle: true }},
  { path: "/index", component: Main, meta: { hasSpecialStyle: true }},
  { path: '/login', component: Login },
  { path: "/wip", component: Test },
  { path: "/editor", component: Editor },
  /*
  { path: "/area/:hunt/:pgid", component: Area },
  { path: "/announcement/:hunt", component: Announcements },
  { path: "/announcements/:hunt", component: Announcements },
  { path: "/scoreboard/:hunt", component: Leaderboard },
  { path: "/scoreboards/:hunt", component: Leaderboard },
  { path: "/main/:hunt", component: Main, meta:{hasSpecialCustomStyle: true} },
  { path: "/article/:hunt/:key", component: ArticlePage },
  { path: "/articles/:hunt/:key", component: ArticlePage },
  { path: "/puzzle/:hunt/:pgid/:pid", component: Puzzle },
  { path: "/puzzles/:hunt/:pgid/:pid", component: Puzzle },
  { path: "/problems/:hunt/:pgid/:pid", component: Puzzle },
  { path: "/problem/:hunt/:pgid/:pid", component: Puzzle },
  { path: "/404", component: NotFound },
  */
  { path: "/:catchAll(.*)", component: NotFound },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
