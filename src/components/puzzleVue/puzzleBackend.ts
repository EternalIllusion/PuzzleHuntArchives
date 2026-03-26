import { getPuzzleBackend, getPidIndex, getPuzzleInfoById } from "../../api";
import { AxiosResponse } from "axios";
import { ProblemContent } from "../../dataschem/interfaces";

export async function puzzleBackend(key: string, data: any) {
    //获取本地状态（正式比赛时在用户浏览器存储的数据）
    let status = getPuzzleBackendLocalStatus(key);

    //执行脚本
    const response = await callPuzzleBackendScript(key, data, status);

    //更新本地状态
    updatePuzzleBackendLocalStatus(key, response.stores);

    return response.data;
}

export async function checkAnswer(key: string, pid:string, originalAnswer:string, answer: string) {
    //获取本地状态（正式比赛时在用户浏览器存储的数据）
    let status = getPuzzleBackendLocalStatus(key);

    //执行脚本
    const response = await callCheckAnswerScript(key, status, pid, originalAnswer, answer);

    //更新本地状态
    updatePuzzleBackendLocalStatus(key, response.stores);

    return response.data;
}

function getPuzzleBackendLocalStatus(key: string) {
    let status = localStorage.getItem(`puzzleBackendStatus-${key}`);
    if (status === null) {
        return {};
    }
    return JSON.parse(status);
}

function updatePuzzleBackendLocalStatus(key: string, stores: any) {
    localStorage.setItem(`puzzleBackendStatus-${key}`, JSON.stringify(stores));
}

const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

async function callPuzzleBackendScript(key: string, data: any, status: any) {
    //读取url的?c=xxx参数
    const url = new URL(window.location.href);
    const huntr = url.href.split('/').filter(Boolean);
    if (!huntr) {
        throw new Error("projectPath not found in url.");
    }
    console.log('hunt:', huntr);
    const hunt = huntr[huntr.length - 3];


    //加载对应的脚本
    const script = await getPuzzleBackend(hunt, key);

    const sandBoxScript = new AsyncFunction('ctx', `
        with(ctx) {
            ${script}
        }
        return ctx;
    `);

    //准备ctx
    const requestString = JSON.stringify(data);
    const problemStatusStore = localStorage.getItem(`puzzleBackendStatus-${hunt}-problemStatus`);
    const problemStatus = problemStatusStore === null ? {} : JSON.parse(problemStatusStore);
    const ctx = new PuzzleScriptContext(hunt, status, requestString, problemStatus);

    //执行脚本
    const response = await sandBoxScript(ctx);

    console.debug(response);

    //更新problemStatus
    if (ctx.__isStatusChanged) {
        localStorage.setItem(`puzzleBackendStatus-${hunt}-problemStatus`, JSON.stringify(problemStatus));
    }
    const responseData = JSON.parse(ctx.__response);

    console.log('backend script result:', responseData)


    return {
        data: responseData,
        stores: ctx.__store
    }
}

async function callCheckAnswerScript(key: string, status:any, pid:string, originalAnswer:string, answer: string) {
    //读取url的?c=xxx参数
    const url = new URL(window.location.href);
    const huntr = url.href.split('/').filter(Boolean);
    if (!huntr) {
        throw new Error("projectPath not found in url.");
    }
    console.log('hunt:', huntr);
    const hunt = huntr[huntr.length - 3];


    //加载对应的脚本
    const script = await getPuzzleBackend(hunt, key);

    const sandBoxScript = new AsyncFunction('ctx', `
        with(ctx) {
            ${script}
        }
        return ctx;
    `);

    //准备ctx
    const requestString = JSON.stringify({});
    const problemStatusStore = localStorage.getItem(`puzzleBackendStatus-${hunt}-problemStatus`);
    const problemStatus = problemStatusStore === null ? {} : JSON.parse(problemStatusStore);
    const ctx = new checkAnserContext(hunt, status, requestString, problemStatus, pid, originalAnswer, answer);

    //执行脚本
    const response = await sandBoxScript(ctx);

    console.debug(response);

    //更新problemStatus
    if (ctx.__isStatusChanged) {
        localStorage.setItem(`puzzleBackendStatus-${hunt}-problemStatus`, JSON.stringify(problemStatus));
    }
    const responseData = {
        result: ctx.result,
        isHitMilestone: ctx.isHitMilestone,
        extraMessage: ctx.extraMessage,
    }

    console.log('backend script result:', responseData)


    return {
        data: responseData,
        stores: ctx.__store
    }
}


class PuzzleScriptContext {
    __hunt: string;
    __store: any;
    __problemStatus: any;
    __isStatusChanged: boolean = false;
    __response: any;

    request?: string;
    uid: number = 0xccbc;
    username: string = "Archive";
    gid: number = 1;

    constructor(hunt: string, store: any, request: string, problemStatus: any) {
        this.__hunt = hunt;
        this.__store = store;
        this.__problemStatus = problemStatus;
        this.request = request;
    }

    getStatus(key: string) {
        return this.__store[key];
    }
    setStatus(key: string, value: any) {
        this.__store[key] = value;
    }
    response(data: string) {
        this.__response = data;
    }
    getProgress(pid: any, key: string) {
        return this.__problemStatus[pid as string]?.progress[key];
    }
    setProgress(pid: any, key: string, value: any) {
        if (this.__problemStatus[pid as string] === undefined) {
            this.__problemStatus[pid as string] = { progress: {} };
        }
        this.__problemStatus[pid as string].progress[key] = value;
        this.__isStatusChanged = true;
    }
    hasPuzzleFinished(pid: any) {
        console.log(pid)
        return true;
    }
    async getPuzzleData(pid: any) {
        //读取指定pid的题目
        //首先读取map来确定题目路径
        const cfg = await getPidIndex(this.__hunt);

        const qcfg = (cfg ?? {})[pid as string] ?? { pid: "", pgid: "" }

        type PuzzleResponse = AxiosResponse<ProblemContent>;
        const pcfg = await getPuzzleInfoById<PuzzleResponse>(this.__hunt, qcfg.pgid, qcfg.pid)

        //从题目中html段提取<data></data>中的数据
        const data = pcfg?.data?.vueTemplate?.match(/<data>([\s\S]*?)<\/data>/)?.[1];
        return data;
    }
    getStorage(key: string) {
        return localStorage.getItem(`puzzleGlocalServerBackendStorage-${key}`);
    }
    setStorage(key: string, value: string) {
        localStorage.setItem(`puzzleGlocalServerBackendStorage-${key}`, value);
    }
    getGroupName(gid: number) {
        console.log(gid);
        return "Archive Team";
    }
    getRankAndWinner(gid: number) {
        console.log(gid);
        return { rank: 123, champion: "Champion" };
    }
    async httpPostForm(url: string, form: { [key: string]: string }, headers: object) {
        //使用fetch发送post请求
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...headers
            },
            body: new URLSearchParams(form).toString()
        });
        //return string
        return await response.text();
    }

}

class checkAnserContext extends PuzzleScriptContext {
    originalAnswer: string;
    answer: string;
    pid: string;

    result: boolean = false;
    extraMessage: string = "答案错误！";
    isHitMilestone: boolean = false;

    constructor(hunt: string, store: any, request: string, problemStatus: any, pid: string, originalAnswer: string, answer: string) {
        super(hunt, store, request, problemStatus)
        this.originalAnswer = originalAnswer;
        this.answer = answer;
        this.pid = pid;
    }

    setShowAnswer(answer: string) {
        if (!this.__problemStatus.ContainsKey(this.pid)) {
            this.__problemStatus[this.pid] = {} as Record<string, string>;
        }
        this.__problemStatus[this.pid]["__$$ShowAnswer"] = answer;
        this.__isStatusChanged = true;
    }

    setResult(result: boolean) {
        this.result = result;
    }

    setExtraMessage(message: string) {
        this.extraMessage = message;
    }

    hitMilestone(hit: boolean) {
        this.isHitMilestone = hit;
    }
}