// 在content script开头添加
console.log('Content script loaded at:', window.location.href);

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  if (request.action === 'extractContent') {
    try {
      // 创建Readability对象
      const documentClone = document.cloneNode(true);
      const article = new Readability(documentClone).parse();
      
      if (!article) {
        throw new Error('无法提取页面内容');
      }

      // 创建TurndownService实例
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
      });
      
      // 转换HTML为Markdown
      const markdown = turndownService.turndown(article.content);
      
      // 限制内容长度，防止超出API限制
      const truncatedContent = markdown.slice(0, 8000); // 根据API的具体限制调整
      
      // 返回提取的内容
      sendResponse({
        title: article.title || document.title,
        content: truncatedContent,
        excerpt: article.excerpt,
        byline: article.byline,
        success: true
      });
    } catch (error) {
      console.error('Content extraction error:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    }
  }
  // 必须返回true以支持异步响应
  return true;
}); 