// storage.js
export function getAIConfig(callback) {
  chrome.storage.local.get(['ai_model', 'deepseek_api_key', 'chatgpt_api_key', 'gemini_api_key'], callback);
}

export function setAIConfig(config, callback) {
  chrome.storage.local.set(config, callback);
} 