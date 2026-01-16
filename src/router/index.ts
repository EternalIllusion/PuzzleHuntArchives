import { createRouter, createWebHashHistory } from "vue-router";
import Main from "../layouts/Main.vue";
import Area from "../layouts/Area.vue";
import ArticlePage from "../layouts/Article.vue";
import Navi from "../layouts/Navi.vue";
import NotFound from "../layouts/NotFound.vue";
import Puzzle from "../layouts/Puzzle.vue";
import Announcements from "../layouts/Announcements.vue";
import Leaderboard from "../layouts/Leaderboard.vue";

import wip from "../layouts/wip.vue";

const routes = [
  { path: "/", component: Navi, meta: { hasSpecialStyle: true }},
  { path: "/index", component: Navi, meta: { hasSpecialStyle: true }},
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
  { path: "/wip", component: wip },
  { path: "/:catchAll(.*)", component: NotFound },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
