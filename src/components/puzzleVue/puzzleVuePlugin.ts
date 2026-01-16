import { Plugin } from "vue";
import service from "../../api/axios";
import { markdownToHtml, dateFormat, adjustTextColor, fetchPostWithSign } from "../../utils";
import { deviceInfo } from "../../utils/device";
import { sleep } from "radash";
// import { globalBus } from '../../globalConst';
import RoleBadge from "../RoleBadge.vue";
import extremeInput from "./extremeInput.vue";
// import Three from '../three.vue';
import { puzzleBackend } from "./puzzleBackend";
// import CopyPuzzle from "../CopyPuzzle.vue";

const puzzleVuePlugin: Plugin = {
  install(app) {
    app.provide("service", service);
    app.provide('api', fetchPostWithSign);
    app.provide("adjustTextColor", adjustTextColor);
    app.provide("formatTimestamp", dateFormat);
    app.provide("markdownToHtml", markdownToHtml);
    app.provide("sleep", sleep);
    app.provide("backend", puzzleBackend);
    app.provide("deviceInfo", deviceInfo);
    // app.provide('globalBus', globalBus);
    app.component("role-badge", RoleBadge);
    app.component("extreme-input", extremeInput);
    // app.component("copy-puzzle",CopyPuzzle);
    // app.component('three', Three);
  },
};

export default puzzleVuePlugin;
