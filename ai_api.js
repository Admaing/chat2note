// ai_api.js
export async function generateNote(model, content, apiKey) {
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