import hmacSha1 from "crypto-js/hmac-sha1";
import encBase64 from "crypto-js/enc-base64";

export function hmac_sha1(text: string, pass: string) {
  let encrypted = hmacSha1(text, pass);

  let res = encBase64.stringify(encrypted);
  return res;
}

import { marked } from "marked";

export function markdownToHtml(markdown: string): string {
  if (markdown == "" || markdown == null) return "";
  return marked(markdown, {
    mangle: false,
    headerIds: false,
  });
}

import dayjs from "dayjs";
import service from "../api/axios";
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

export function getFoooterColor() { }

// 兼容旧接口
export async function fetchPostWithSign<T>(
  url: string,
  data: object,
  type: "normal" | "sp" = "normal"
) {
  if (type == "sp") {
    let wsApiPrefix = import.meta.env.VITE_WS_HOST.replace(
      "wss://",
      "https://"
    );
    url = wsApiPrefix + url;
  }

  return await service.request<any, T>({
    method: "post",
    url,
    data,
  });
}

export function badge(type: number|undefined) {
  if(!type) return undefined;
  switch(type){
    case 0:
      return null;
    case 1:
      return 'META';
    case 2:
      return 'META META';
    case 3:
      return "FINAL META"
    case 4:
      return "不计分"
  }
};

export function isfinalmeta(type: number|undefined){
  if(!type) return false;
  return type===3?true:false;
}