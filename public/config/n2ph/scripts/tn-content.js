// @ts-check

function checkProgress() {
    let results = 0;
    const pids  = [1,2,3,4,5,6,7,8]
    pids.forEach(function(i){
        try{
            results += ctx.hasPuzzleFinished(i)?1:0;
        }
        catch(e){
            results -= 100;
        }
    })
    return results;
}

// ========== 服务端 main 函数 ==========
function main() {
    const targetDateTime = new Date(2025, 11, 31, 12, 0, 0);

    const now = new Date();

    if (now > targetDateTime) {
        const prog = checkProgress();
        if(prog>=4){
            return `<table border="1">
                <tr>
                    <td>S</td>
                    <td>C</td>
                    <td>O</td>
                    <td>V</td>
                    <td>A</td>
                    <td>D</td>
                    <td>A</td>
                    <td>R</td>
                    <td>I</td>
                </tr>
                <tr>
                    <td>E</td>
                    <td>E</td>
                    <td>C</td>
                    <td>E</td>
                    <td>P</td>
                    <td>S</td>
                    <td>L</td>
                    <td>K</td>
                    <td>M</td>
                </tr>
                <tr>
                    <td>R</td>
                    <td>G</td>
                    <td>A</td>
                    <td>R</td>
                    <td>H</td>
                    <td>S</td>
                    <td>E</td>
                    <td>N</td>
                    <td>I</td>
                </tr>
                <tr>
                    <td>B</td>
                    <td>L</td>
                    <td>O</td>
                    <td>P</td>
                    <td>O</td>
                    <td>S</td>
                    <td>T</td>
                    <td>O</td>
                    <td>T</td>
                </tr>
                <tr>
                    <td>E</td>
                    <td>E</td>
                    <td>C</td>
                    <td>N</td>
                    <td>I</td>
                    <td>I</td>
                    <td>Y</td>
                    <td>E</td>
                    <td>A</td>
                </tr>
                <tr>
                    <td>G</td>
                    <td>A</td>
                    <td>K</td>
                    <td>O</td>
                    <td>I</td>
                    <td>T</td>
                    <td>T</td>
                    <td>I</td>
                    <td>L</td>
                </tr>
                <tr>
                    <td>R</td>
                    <td>S</td>
                    <td>U</td>
                    <td>N</td>
                    <td>H</td>
                    <td>S</td>
                    <td>H</td>
                    <td>A</td>
                    <td>I</td>
                </tr>
                <tr>
                    <td>E</td>
                    <td>E</td>
                    <td>S</td>
                    <td>S</td>
                    <td>P</td>
                    <td>D</td>
                    <td>P</td>
                    <td>D</td>
                    <td>M</td>
                </tr>
                <tr>
                    <td>S</td>
                    <td>N</td>
                    <td>I</td>
                    <td>H</td>
                    <td>A</td>
                    <td>E</td>
                    <td>W</td>
                    <td>O</td>
                    <td>I</td>
                </tr>
            </table>
            <div class="pz-centred ital">
                <p>
                    an instance of obstructing<br><br>
                    the act or fact of obscuring<br><br>
                    the state of near absence of light<br><br>
                    a certain arrangement of objects<br><br>
                    cast a shade over<br><br>
                    the light or direct rays of the sun<br><br>
                    the phase of full concealment<br><br>
                </p>
            </div>
            <p>Ans: _ _ _ _ _ _ _</p>`;
        }
        else{
            if(prog<0){
                return `<h1>题目数据异常，请发送站内信上报管理员。错误码： SDE${prog}_${ctx.gid}_${ctx.uid}</h1>`;
            }
            else{
                return `<h1>您需要完成至少四道不计分题目才能查看本题。</h1><br /><h3>当前已完成：${prog} / 8 题。您还需要完成 ${4-prog} 题来解锁本题。</h3>`
            }
        }
        
    } else {
        return `<h1>未知错误，请发送站内信上报管理员。错误码： CTK_${ctx.gid}_${ctx.uid}</h1>`;
    }

}

//=======以下是JSON解析与调用脚本，一般不需要修改========
/**
 * @param {Ctx} ctx 全局上下文对象
 */

function _jsonProcessHelper(ctx) {
    let request = JSON.parse(ctx.request);
    request = request;
    let resBody = main();
    let resString = JSON.stringify(resBody);
    ctx.response(resString);
}

_jsonProcessHelper(ctx);