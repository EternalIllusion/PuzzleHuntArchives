import service from "../api/axios";
import { AxiosResponse } from "axios";



export const getPuzzleInfoById = <T>(hunt: string, pgid: string, pid: string) => {
  return service<any, T>({
    url: `/${hunt}/problems/${pgid}/${pid}.json`,
    method: "get",
  });
};

export const getSiteConfig = <T>() => {
  return service<any, T>({
    url: `/hunts.json`,
    method: "get",
  });
};

import { HuntThemeCfg,article,articles,Area,IndexData, PidIndex, Announcements,Scoreboard } from "../dataschem/interfaces";

type AreaCfgResponse = AxiosResponse<Area>;
export const getAreaInfo = async (hunt: string, area: string) => {
  let data = await service<any, AreaCfgResponse>({
    url: `/${hunt}/area/${area}.json`,
    method: "get",
  });
  if(data.status>299){
    return null
  }
  return data.data;
};

type HuntCfgResponse = AxiosResponse<HuntThemeCfg>;
export const getHuntTheme = async (hunt:string) => {
  let data = await service<any, HuntCfgResponse>({
    url: `/${hunt}/theme.json`,
    method: "get",
  });
  if(data.status>299){
    return null
  }
  return data.data;
};

type ArticleCfgResponse = AxiosResponse<articles>;
export const getArticles = async (hunt:string) => {
  let data = await service<any, ArticleCfgResponse>({
    url: `/${hunt}/articles/index.json`,
    method: "get",
  });
  if(data.status>299){
    return null
  }
  return data.data;
};

type AnnoCfgResponse = AxiosResponse<Announcements>;
export const getAnno = async (hunt:string) => {
  let data = await service<any, AnnoCfgResponse>({
    url: `/${hunt}/announcements.json`,
    method: "get",
  });
  if(data.status>299){
    return null
  }
  return data.data;
};

type ArticleResponse = AxiosResponse<article>;
export const getArticleByKey = (hunt: string, key: string) => {
  return service<any, ArticleResponse>({
    url: `/${hunt}/articles/${key}.json`,
    method: "get",
  });
};

type IndexResponse = AxiosResponse<IndexData>;
export const getMainInfo = async (hunt: string) => {
  let data = await service<any, IndexResponse>({
    url: `/${hunt}/index.json`,
    method: "get",
  });
  if(data.status>299){
    return null
  }
  return data.data;
};

type PidResponse = AxiosResponse<Record<string,PidIndex>>;
export const getPidIndex = async (hunt: string) => {
  let data = await service<any, PidResponse>({
    url: `/${hunt}/index.json`,
    method: "get",
  });
  if(data.status>299){
    return null
  }
  return data.data;
};

type SbResponse = AxiosResponse<Scoreboard>;
export const getScoreboard = async (hunt: string) => {
  let data = await service<any, SbResponse>({
    url: `/${hunt}/scoreboard.json`,
    method: "get",
  });
  if(data.status>299){
    return null
  }
  return data.data;
};


export const getPuzzleBackend = async (hunt:string, key: string) => {
  let data = await service<any, AxiosResponse<string>>({
    url: `/${hunt}/scripts/${key}.js`,
    method: "get",
    responseType: 'text',
  });
  if(data.status>299){
    return null
  }
  return data.data;
};
