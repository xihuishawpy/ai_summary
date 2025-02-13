# AI Summary Chrome Extension

一个使用智谱AI API自动总结网页内容的Chrome插件。

## 功能特性

1. 网页内容提取: 使用 mozilla/readability 库准确提取正文内容
2. 格式转换: 使用 Turndown 将 HTML 内容转换为 Markdown 格式
3. 摘要生成: 使用智谱AI API生成文章摘要
4. 支持多种长度的摘要
5. 支持复制和分享功能

## 开发设置

1. 克隆仓库到本地
2. 下载依赖库:
   - 将 Readability.js 下载到 lib 目录
   - 将 turndown.js 下载到 lib 目录
3. 准备图标:
   - 将 icon.png (128x128px) 放入 assets 目录

## 安装说明

1. 打开Chrome浏览器，访问 `chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目目录

## 使用说明

1. 点击插件图标打开popup界面
2. 在选项页面设置智谱AI API密钥
3. 选择需要的摘要长度
4. 点击"生成摘要"按钮
5. 等待摘要生成后可以复制或分享

## API密钥获取

1. 访问智谱AI官网：https://www.bigmodel.cn/
2. 注册账号并登录
3. 在控制台获取API密钥
4. 将API密钥配置到插件的选项页面

## 注意事项

- 请确保API密钥安全，不要分享给他人
- 建议在选项页面设置API密钥后再使用插件
- 如遇到问题，请检查浏览器控制台的错误信息