export interface Link {
  title: string;
  type?: 'index' | 'puzzle' | 'article' | 'area' | 'scoreboard' | 'announcements' | string;
  path: string;
}

export interface PidIndex extends Link {
  pgid: string;
  pid: string;
}

export interface IndexData {
  type?: 'index';
  title: string;
  content: string;
  links: Link[];
  navs: Link[];
}

// 提示（Tips）
export interface PuzzleTip {
  title: string;           // "提示标题 (114514提示点)"
  content: string;         // 文本
}

// 额外答案（Additional Answers / Milestones）
export interface AdditionalAnswer {
  answer: string;          // 额外答案
  message: string;         // 提示消息
  extra?: string;          // 可选字段
}

// 主题目内容对象
export interface ProblemContent {
  type: 'problem' | string;               // 固定字面量
  title: string;                          // 题目标题
  extendData: any;                        // 原样透传 problem['extend_data']
  contentType: number;                    // 0: image, 1: html, 2: vue-sfc

  content: string;                        // 主内容（HTML/文本），经 handle_static 处理
  vueTemplate?: string;                   // vue
  vueScript?: string;                     // vue脚本/脚本模块链接

  extendContent?: string;                 // 扩展内容
  problemImage?: string;                  // 题目配图 URL

  answer: string;                         // 标准答案
  desc: string;                           // 题目ft

  tips?: PuzzleTip[];                     // 提示列表
  additionalAnswers?: AdditionalAnswer[]; // 里程碑
  answerAnalysis?: string;                // 题解

  links: Link[];                          // 链接
  arealink?: Link;
}

export interface Hunt{
  title:string;
  subtitle:string;
  start:string;
  end:string;
  logo:string;
  path:string;
}

export interface SiteConfig {
  title:string;
  siteLogo:string;
  hunts:Hunt[];
}

export interface NavBarItem {
  path: string;
  title: string;
}

export interface PuzzleColorCfg {
  bg?: string;
  bg2?: string;
  text?: string;
  navText?: string;
  navBg?: string;
}

export interface ThemeColorCfg {
  text?: string;
  bg?: string;
  navText?: string;
  navBg?: string;
  puzzListBg?: string;
  puzzListItemBg?: string;
  puzzListText?: string;
  puzzCfg?: Record<string,PuzzleColorCfg>;
}

export interface MapCfg {
  pid: string;
  imgUrl: string;
  color: string;
  top: string;
  left: string;
  puzzle_type?: number;
  title?: string;
  titleOffsetX?: number;
  titleOffsetY?: number;
}

export type HuntThemeColorCfg = Record<string,ThemeColorCfg>

export interface AreaMapCfg {
  bg?:string;
  front?:string;
  mapItem:MapCfg[];
  originalWidth: number;
  originalHeight: number;
  logo?:string;
  snapMargin?:number;
}

export interface HuntThemeCfg {
  colors: HuntThemeColorCfg;
  maps: Record<string,AreaMapCfg>;
}

export interface article {
  title:string;
  content:string;
  type: 'page'|'article'|string;
}

export interface articles {
  title:string;
  type: 'page'|'article'|string;
  content:string;
  links:Link[];
}

export interface Problem {
  pid: string,
  title: string;
  type: number, 
  path: string;
}

export interface Area {
  title:string;
  problems:Problem[];
}

export interface Announcement {
  aid:number;
  content:string;
  create_time:number;
  update_time:number;
}

export interface Announcements {
  type:string;
  title:string;
  content:string;
  announcements:Announcement[];
}

export interface UserInfo {
  is_leader: number;
  username: string;
  avatar: string;
  theme_color: string;
}

export interface ScoreboardGroupInfo {
  gid: number;
  groupName: string;
  groupProfile: string;
  users: UserInfo[];
  isFinish: number;
  totalTime: number;
  finishedGroupCount: number;
  finishedPuzzleCount: number;
}

export interface ScoreboardData {
  finished_groups: ScoreboardGroupInfo[];
  groups: ScoreboardGroupInfo[];
}

export interface Scoreboard {
  type: string;
  title: string;
  content: string;
  scoreboarddata: ScoreboardData;
}