// @ts-check

// ========== 服务端 main 函数 ==========
function main() {
    let results = [-1,-1,-1,-1,-1,-1,-1,-1]
    const pids  = [1,2,3,4,5,6,7,8]
    pids.forEach(function(i){
        try{
            results[i-1] = ctx.hasPuzzleFinished(i);
        }
        catch(e){}
    })
    return results;
}

//=======以下是JSON解析与调用脚本，一般不需要修改========
/**
 * @param {Ctx} ctx 全局上下文对象
 */

function _jsonProcessHelper(ctx) {
    let request = JSON.parse(ctx.request);
    request = request;
    let resBody = main(ctx);
    let resString = JSON.stringify(resBody);
    ctx.response(resString);
}

_jsonProcessHelper(ctx);