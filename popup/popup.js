document.addEventListener('DOMContentLoaded', function() {
  const summarizeButton = document.getElementById('summarize');
  const copyButton = document.getElementById('copy');
  const shareButton = document.getElementById('share');
  const lengthSelect = document.getElementById('length');
  const summaryDiv = document.getElementById('summary');
  const loadingDiv = document.getElementById('loading');

  // 生成摘要
  summarizeButton.addEventListener('click', async () => {
    loadingDiv.classList.remove('hidden');
    summaryDiv.textContent = '';

    try {
      // 获取当前标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        throw new Error('无法获取当前标签页');
      }

      // 注入content script
      await ensureContentScriptInjected(tab.id);

      // 提取页面内容
      const result = await chrome.tabs.sendMessage(tab.id, {
        action: 'extractContent',
        options: {
          length: lengthSelect.value
        }
      }).catch(error => {
        throw new Error('无法与页面通信，请刷新页面后重试');
      });

      if (!result || !result.success) {
        throw new Error(result?.error || '内容提取失败');
      }

      // 调用background script处理内容
      const summary = await chrome.runtime.sendMessage({
        action: 'generateSummary',
        content: result.content,
        title: result.title,
        length: lengthSelect.value
      });

      summaryDiv.textContent = summary;
    } catch (error) {
      console.error('摘要生成错误:', error);
      summaryDiv.textContent = '生成摘要时出错：' + error.message;
    } finally {
      loadingDiv.classList.add('hidden');
    }
  });

  // 确保content script已注入
  async function ensureContentScriptInjected(tabId) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          return window.hasOwnProperty('Readability') && 
                 window.hasOwnProperty('TurndownService');
        }
      });
    } catch (error) {
      console.log('Injecting content scripts...');
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['lib/readability.js', 'lib/turndown.js', 'content/content.js']
      });
    }
  }

  // 复制摘要
  copyButton.addEventListener('click', () => {
    const text = summaryDiv.textContent;
    if (!text) {
      alert('没有可复制的内容');
      return;
    }

    navigator.clipboard.writeText(text)
      .then(() => {
        alert('摘要已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制');
      });
  });

  // 分享摘要
  shareButton.addEventListener('click', async () => {
    const text = summaryDiv.textContent;
    if (!text) {
      alert('没有可分享的内容');
      return;
    }

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const shareText = `${text}\n\n原文链接：${tab.url}`;
      
      if (navigator.share) {
        await navigator.share({
          title: '网页摘要',
          text: shareText,
          url: tab.url
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('摘要和链接已复制到剪贴板');
      }
    } catch (error) {
      console.error('分享失败:', error);
      alert('分享失败，请手动复制');
    }
  });
}); 