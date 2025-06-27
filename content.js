// storage.js
function getAIConfig(callback) {
  chrome.storage.local.get(['ai_model', 'deepseek_api_key', 'chatgpt_api_key', 'gemini_api_key'], callback);
}
function setAIConfig(config, callback) {
  chrome.storage.local.set(config, callback);
}

// ai_api.js
async function generateNote(model, content, apiKey) {
  const prompt = `请将以下对话内容整理成一份适合学习的Markdown笔记，内容需包含所有对话：\n\n${content}`;
  if (model === 'deepseek') {
    return await callDeepSeek(prompt, apiKey);
  } else if (model === 'chatgpt') {
    return await callChatGPT(prompt, apiKey);
  } else if (model === 'gemini') {
    return await callGemini(prompt, apiKey);
  }
  return '暂不支持该模型';
}
async function callDeepSeek(prompt, apiKey) {
  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {role: 'system', content: '你是一个笔记助手'},
          {role: 'user', content: prompt}
        ]
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '生成失败';
  } catch (e) {
    return 'API 调用失败：' + e.message;
  }
}
async function callChatGPT(prompt, apiKey) {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {role: 'system', content: '你是一个笔记助手'},
          {role: 'user', content: prompt}
        ]
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '生成失败';
  } catch (e) {
    return 'API 调用失败：' + e.message;
  }
}
async function callGemini(prompt, apiKey) {
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        contents: [{parts: [{text: prompt}]}]
      })
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '生成失败';
  } catch (e) {
    return 'API 调用失败：' + e.message;
  }
}

// ui.js
function showNoteModal(note) {
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
function createMainNoteButton(onClick) {
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

console.log('content.js loaded');

function insertMainNoteButton() {
    if (document.querySelector('.ai-main-note-btn')) return;
    const btn = createMainNoteButton(async () => {
        const chatContents = Array.from(document.querySelectorAll('message-content .markdown-main-panel'))
            .map(el => el.innerText.trim())
            .filter(Boolean)
            .join('\n\n');
        if (!chatContents) {
            alert('未找到聊天内容，请确认你在对话详情页');
            return;
        }
        btn.innerText = '生成中...';
        const model = 'deepseek'; // 如需支持多模型可自行扩展
        const apiKey = prompt(`请输入${model} API Key：`);
        if (!apiKey) {
            btn.innerText = '生成笔记';
            alert('未输入API Key，无法生成笔记');
            return;
        }
        const note = await generateNote(model, chatContents, apiKey);
        btn.innerText = '生成笔记';
        showNoteModal(note);
    });
    document.body.appendChild(btn);
}

insertMainNoteButton(); 