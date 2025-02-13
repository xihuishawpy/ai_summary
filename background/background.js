// 存储API密钥
let API_KEY = '';

// 从storage中获取API密钥
chrome.storage.local.get(['zhipuApiKey'], (result) => {
  if (result.zhipuApiKey) {
    API_KEY = result.zhipuApiKey;
  }
});

// 处理来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateSummary') {
    generateSummary(request)
      .then(summary => sendResponse(summary))
      .catch(error => sendResponse(`生成摘要失败: ${error.message}`));
    return true;
  }
});

// 生成摘要的主要函数
async function generateSummary({ content, title, length }) {
  if (!API_KEY) {
    throw new Error('请先设置智谱AI API密钥');
  }

  // 根据长度选项设置提示词
  const lengthPrompt = {
    short: '请用100字左右总结',
    medium: '请用300字左右总结',
    long: '请用500字左右总结'
  }[length];

  // 构建提示词
  const prompt = `
    请你作为一个专业的文章摘要工具，帮我总结以下文章的主要内容。
    ${lengthPrompt}，确保包含文章的关键信息和主要观点。
    
    文章标题：${title}
    
    文章内容：
    ${content}
  `;

  try {
    // 调用智谱AI API
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "glm-4",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 2000,
        stream: false
      })
    });

    const data = await response.json();
    console.log('API Response:', data);

    // 检查错误响应
    if (data.error) {
      throw new Error(data.error.message || '调用API失败');
    }

    // 检查响应格式
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new Error('API响应格式不正确');
    }

    const choice = data.choices[0];
    if (!choice.message || !choice.message.content) {
      throw new Error('API响应中没有找到内容');
    }

    return choice.message.content;
  } catch (error) {
    console.error('API调用错误:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('无法连接到API服务器，请检查网络连接');
    }
    throw error;
  }
} 