// @ts-check

// ========== 服务端 main 函数 ==========
function main() {
    const targetDateTime = new Date(2025, 11, 31, 12, 0, 0);

    const now = new Date();

    const baseNumber = 1145141919325609;
    const offset = 33554432;

    if (now > targetDateTime) {
        // 是目标日期 20:00 之后（包括未来任意时间）
        // 返回 baseNumber 的倍数 + offset（这里用 1 倍，也可改用随机倍数）
        return baseNumber * Math.floor(Math.random()*5.99+1) + offset;
    } else {
        // 当前时间未到或正好是目标日 20:00 前（含等于也不满足“之后”）
        const min = baseNumber + 1; // 必须大于 baseNumber
        const max = Number.MAX_SAFE_INTEGER;

        // 生成 [min, max] 范围内的随机整数
        const range = max - min + 1;
        // Math.random() 最多提供约 53 位精度，但在此范围内足够生成安全整数
        const randomOffset = Math.floor(Math.random() * range);
        return min + randomOffset;
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