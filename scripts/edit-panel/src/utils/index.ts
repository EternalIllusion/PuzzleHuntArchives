import { marked } from "marked";

export async function markdownToHtml(markdown: string): Promise<string> {
  if (markdown == "" || markdown == null) return "";
  return await marked.parse(markdown);
}

import dayjs from "dayjs";
// import * as isLeapYear from "dayjs/plugin/isLeapYear"; // 导入插件
// import "dayjs/locale/zh-cn"; // 导入本地化语言

// dayjs.extend(isLeapYear); // 使用插件
// dayjs.locale("zh-cn"); // 使用本地化语言

export function dateFormat(timestamp: number, format = "YYYY-M-D HH:mm:ss") {
  return dayjs(timestamp).format(format);
}

export function adjustTextColor(color: string) {
  let r = parseInt(color.slice(1, 3), 16);
  let g = parseInt(color.slice(3, 5), 16);
  let b = parseInt(color.slice(5, 7), 16);

  let brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 110 ? "#000000" : "#ffffff";
}