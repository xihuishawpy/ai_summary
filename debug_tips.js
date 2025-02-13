// 在 background.js 中添加调试日志
console.log('Background script loaded');

// 在 content.js 中添加调试日志
console.log('Content script loaded');

// 在 popup.js 中添加调试日志
console.log('Popup loaded');

// 查看调试信息：
// 1. 右键点击插件图标，选择"审查弹出内容"查看popup的控制台
// 2. 打开开发者工具查看content script的控制台
// 3. 在扩展管理页面点击"service worker"查看background script的控制台 