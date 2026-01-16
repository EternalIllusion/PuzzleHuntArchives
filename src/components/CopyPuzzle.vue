<script setup lang="ts">
defineProps({
    textContent: {
        type: String,
        required: true,
    },
    xmlContent: {
        type: String,
        required: true,
    },
});

const writeClipboard = async(tc:string,xc:string) => {
    try {
        const clipboardItem = new ClipboardItem({
            'text/plain': new Blob([tc], { type: 'text/plain' }),
            'text/html': new Blob([xc], { type: 'text/html' })
        });
        await navigator.clipboard.write([clipboardItem]);
        alert('复制成功，快去Excel、腾讯文档表格粘贴吧！');
    } catch (err) {
        console.error('写入粘贴板失败: ', err);
        alert('写入粘贴板失败，请检查浏览器权限或是否支持 Clipboard API。');
    }
}
</script>

<template>
    <div class="copy-widgets" style="padding: 1.5rem;">
        <button id="copyBtn"
            style="background-color: #a8a8a8;color: white;padding: 10px 20px;border: none;border-radius: 4px;cursor: pointer;font-size: 16px;"
            @click="writeClipboard(textContent,xmlContent)">复制题干</button>
        <div class="info">
            <p><strong>注意：</strong>此操作会向粘贴板写入题干内容，您可以尝试在支持表格功能的编辑器（如Excel、腾讯文档表格等）中粘贴，查看效果。</p>
        </div>
    </div>
</template>