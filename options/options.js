document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const saveButton = document.getElementById('save');
  const messageDiv = document.getElementById('message');

  // 加载已保存的设置
  chrome.storage.local.get(['zhipuApiKey'], function(result) {
    if (result.zhipuApiKey) {
      apiKeyInput.value = result.zhipuApiKey;
    }
  });

  // 保存设置
  saveButton.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      showMessage('请输入API密钥', 'error');
      return;
    }

    chrome.storage.local.set({
      zhipuApiKey: apiKey
    }, function() {
      showMessage('设置已保存', 'success');
    });
  });

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 3000);
  }
}); 