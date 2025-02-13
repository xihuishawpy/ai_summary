from flask import Flask, request, jsonify
from flask_cors import CORS
import zhipuai
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

app = Flask(__name__)
CORS(app)  # 启用跨域支持

# 配置智谱AI API密钥
zhipuai.api_key = os.getenv("ZHIPUAI_API_KEY")

@app.route('/api/summarize', methods=['POST'])
def summarize():
    try:
        data = request.json
        content = data.get('content')
        title = data.get('title')
        length = data.get('length', 'medium')

        # 根据长度设置提示词
        length_prompt = {
            'short': '请用100字左右总结',
            'medium': '请用300字左右总结',
            'long': '请用500字左右总结'
        }.get(length, '请用300字左右总结')

        # 构建提示词
        prompt = f"""
        请你作为一个专业的文章摘要工具，帮我总结以下文章的主要内容。
        {length_prompt}，确保包含文章的关键信息和主要观点。
        
        文章标题：{title}
        
        文章内容：
        {content}
        """

        # 调用智谱AI API
        response = zhipuai.model_api.invoke(
            model="glm-4",
            prompt=prompt,
            temperature=0.7,
            top_p=0.9,
            max_tokens=2000
        )

        # 检查API响应
        if response['code'] != 200:
            return jsonify({
                'success': False,
                'error': response.get('msg', 'API调用失败')
            }), 500

        # 返回摘要
        return jsonify({
            'success': True,
            'summary': response['data']['choices'][0]['content']
        })

    except Exception as e:
        print(f"Error: {str(e)}")  # 打印详细错误信息
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True) 