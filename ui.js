// ui.js
export function showNoteModal(note) {
    const modal = document.createElement('div');
    modal.style = 'position:fixed;top:10%;left:10%;width:80%;height:80%;background:#fff;z-index:9999;overflow:auto;padding:20px;border:2px solid #333;';
    modal.innerHTML = `<h2>AI 笔记</h2>
        <pre style="white-space:pre-wrap;">${note}</pre>
        <div style="margin-top:16px;">
            <button id="ai-note-close-btn">关闭</button>
            <button id="ai-note-copy-btn">复制</button>
        </div>`;
    document.body.appendChild(modal);
    modal.querySelector('#ai-note-close-btn').onclick = () => modal.remove();
    modal.querySelector('#ai-note-copy-btn').onclick = () => {
        navigator.clipboard.writeText(note);
        modal.querySelector('#ai-note-copy-btn').innerText = '已复制!';
        setTimeout(() => {
            modal.querySelector('#ai-note-copy-btn').innerText = '复制';
        }, 1200);
    };
}

export function createMainNoteButton(onClick) {
    const btn = document.createElement('button');
    btn.innerText = '生成笔记';
    btn.className = 'ai-main-note-btn';
    btn.style.position = 'fixed';
    btn.style.top = '50%';
    btn.style.right = '32px';
    btn.style.transform = 'translateY(-50%)';
    btn.style.zIndex = '9999';
    btn.style.background = '#ffd600';
    btn.style.border = '1px solid #ccc';
    btn.style.borderRadius = '24px';
    btn.style.padding = '14px 28px';
    btn.style.fontSize = '18px';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
    btn.onclick = onClick;
    return btn;
} 