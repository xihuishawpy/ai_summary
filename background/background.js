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
async function generateSummary({ content, title, length, model, customPrompt }) {
  if (!API_KEY) {
    throw new Error('请先设置智谱AI API密钥');
  }

  // 默认提示词
  const defaultPrompt = `
请以规范的markdown格式输出文章分析总结，注意使用正确的markdown语法，包括标题、列表、引用等。具体分析以下几个方面：

## 1. 主题识别

- **本文主题**：...
- **主要讨论**：...
- **重点内容**：...

## 2. 主要观点

- **核心论点**：...
- **重要论据**：...
- **关键要点**：...

## 3. 细节支持

- **数据支持**：...
- **案例说明**：...
- **引用来源**：...

## 4. 结论和影响

- **总体结论**：...
- **影响分析**：...
- **未来展望**：...

## 5. 个人理解

> **观点解读**：...
> **关联思考**：...
> **主题评价**：...

## 6. 进一步探索

- **研究方向**：...
- **相关主题**：...

---

文章标题：${title}

文章内容：
${content}
`;

  // 使用自定义提示词或默认提示词
  const prompt = customPrompt ? 
    `${customPrompt}\n\n文章标题：${title}\n\n文章内容：\n${content}` : 
    defaultPrompt;

  try {
    // 调用智谱AI API
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: model || "glm-4-flash", // 使用选择的模型或默认模型
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