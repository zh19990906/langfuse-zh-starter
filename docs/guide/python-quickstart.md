# Python 快速接入

本页根据 [Langfuse 官方快速入门和开源仓库示例](https://github.com/langfuse/langfuse#-quickstart) 归纳。示例中的模型名称只是演示，请替换为你的账户可用的模型。

## 1. 创建项目和 API Key

使用 [Langfuse Cloud](https://cloud.langfuse.com/) 或自托管实例，创建项目并在项目设置中生成 Public Key 与 Secret Key。

## 2. 安装 Python SDK

```bash
pip install langfuse openai
```

## 3. 配置环境变量

```bash
export LANGFUSE_PUBLIC_KEY='pk-lf-...'
export LANGFUSE_SECRET_KEY='sk-lf-...'
export LANGFUSE_BASE_URL='https://cloud.langfuse.com'
export OPENAI_API_KEY='sk-...'
```

不要把真实密钥提交到 Git 仓库。如果选择其他区域或自托管，请替换 `LANGFUSE_BASE_URL`。

## 4. 执行模型调用并记录 Trace

```python
from langfuse import observe, get_client
from langfuse.openai import openai

@observe()
def ask_model(question: str) -> str:
    response = openai.chat.completions.create(
        model="gpt-4o-mini",  # 替换为你有权限使用的模型
        messages=[{"role": "user", "content": question}],
    )
    return response.choices[0].message.content or ""

if __name__ == "__main__":
    print(ask_model("请用中文介绍 Langfuse"))
    get_client().flush()
```

## 5. 查看追踪

打开 Langfuse 项目中的 Tracing 页面，检查请求、调用结构、Token 消耗和延迟。如未出现数据，检查区域地址、密钥和 SDK 版本。

> [!NOTE]
> API 与 SDK 会持续更新，实际接入请同步查看 [官方 Python SDK 文档](https://langfuse.com/docs/sdk/python/overview)。
