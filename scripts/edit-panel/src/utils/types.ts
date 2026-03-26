export const pageTypes: Record<string, Record<string, string>> = {
  index: {
    title: '站点标题',
    content: '首页说明',
    navs: '顶部导航',
    links: '主链接列表'
  },
  page: {
    title: '页面标题',
    content: '页面描述',
    links: '子页面链接',
    problems: '题目列表'
  },
  problem: {
    title: '题目标题',
    desc: '题目描述',
    contentType: '内容类型(1=html,2=vue,3=vue模块)',
    content: 'HTML/内容',
    vueTemplate: 'Vue模板',
    vueScript: 'Vue脚本/模块文件',
    problemImage: '题目图片',
    answer: '答案',
    extendData: '扩展数据',
    extendContent: '正解后内容',
    answerAnalysis: '答案解析',
    tips: '提示',
    additionalAnswers: '额外答案',
    arealink: '分区链接'
  },
  announcements: {
    title: '公告标题',
    content: '公告说明',
    announcements: '公告列表'
  },
  article: {
    title: '剧情标题',
    content: '剧情内容'
  },
  scoreboard: {
    title: '排行榜标题',
    content: '排行榜说明',
    scoreboarddata: '队伍数据'
  },
  backend_script: {
    title: '脚本描述',
    key: '脚本标识',
    script: '脚本路径'
  }
};