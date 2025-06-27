import { getAIConfig, setAIConfig } from './storage.js';

const modelSelect = document.getElementById('model');
const deepseekInput = document.getElementById('deepseek_api_key');
const chatgptInput = document.getElementById('chatgpt_api_key');
const geminiInput = document.getElementById('gemini_api_key');
const saveBtn = document.getElementById('saveBtn');

// 读取已保存的 key 和模型
getAIConfig((result) => {
  modelSelect.value = result.ai_model || 'deepseek';
  deepseekInput.value = result.deepseek_api_key || '';
  chatgptInput.value = result.chatgpt_api_key || '';
  geminiInput.value = result.gemini_api_key || '';
});

saveBtn.onclick = function() {
  setAIConfig({
    ai_model: modelSelect.value,
    deepseek_api_key: deepseekInput.value.trim(),
    chatgpt_api_key: chatgptInput.value.trim(),
    gemini_api_key: geminiInput.value.trim()
  }, () => {
    alert('已保存！');
  });
}; 