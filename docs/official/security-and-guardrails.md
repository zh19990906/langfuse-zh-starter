---
title: LLM 安全与防护栏
description: 使用 LLM Guard 等工具降低提示词注入、隐私泄露和有害输出风险，并通过 Langfuse 监测。
---
# LLM 安全与防护栏

基于 LLM 的应用存在多种潜在安全风险，例如提示词注入、个人身份信息（PII）泄露和有害请求。Langfuse 可用于监控安全措施的执行、评估其有效性，并在事件发生后协助调查。

[观看 Langfuse LLM 安全监控演示](https://static.langfuse.com/docs-videos/security-langfuse.mp4)。

## 什么是 LLM 安全？

LLM 安全指为模型及其基础设施实施保护措施，防止未经授权的访问、误用和对抗攻击，保证模型与数据的完整性、保密性。它有助于防止提示词注入等攻击，使 AI/ML 系统在可靠、安全的条件下运行。

## 如何实现 LLM 安全？

一般结合两类措施：

1. **运行时安全库**：在模型输入或输出阶段执行保护。
2. **Langfuse 的事后评估**：检查各项安全控制措施是否有效。

### 运行时防护

常见工具包括 [LLM Guard](https://llm-guard.com)、[Prompt Armor](https://promptarmor.com)、[NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails)、[Microsoft Azure AI Content Safety](https://azure.microsoft.com/en-us/products/ai-services/ai-content-safety)、[Lakera](https://www.lakera.ai)。

它们可以：

- 在发送模型前识别并拦截有害或不适当的 Prompt；
- 在发送前匿名化敏感 PII，并在模型响应中恢复相应信息；
- 在运行时检查 Prompt 与 Completion 的毒性、相关性、敏感材料，必要时阻止响应。

### 在 Langfuse 中监控与评估

使用[追踪](/official/observability/overview)观察防护流程每一步，常见工作流：

1. 人工检查 Trace，调查安全事件。
2. 在 Dashboard 中追踪安全 Score 趋势。
3. **验证安全检查**：使用 [Score](/official/evaluation/scores/overview)衡量工具效果。
   - [UI 标注与队列](/official/evaluation/evaluation-methods/annotation-queues)：标注一部分生产 Trace，建立人工基线，与安全库结果对比。
   - [自动评估](https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge)：异步检测毒性、敏感信息与可疑风险，找出防护缺口。
4. **追踪延迟**：有些安全检查必须在模型调用前完成，有些会阻止响应；拆解各步骤延迟，判断安全收益与性能成本是否平衡。

## 快速开始：匿名化 PII

直接把 PII 发送给 LLM，可能带来泄密、数据泄露或违约及监管合规风险。PII 包括信用卡号、姓名、电话号码、邮箱、社会保障号与 IP 地址。

下面的示例应用对法庭记录进行摘要：先匿名化 PII，模型摘要完成后再反匿名化，使最终结果可读。

其他风险（提示词注入、禁止话题、恶意 URL）参阅[安全 Cookbook](https://langfuse.com/docs/security/example-python)。

### 1. 安装依赖

使用开源 [LLM Guard](https://protectai.github.io/llm-guard/)执行运行时检查；其他安全库也可采用类似方式集成。

```bash
pip install llm-guard langfuse openai
```

```python
from llm_guard.input_scanners import Anonymize
from llm_guard.input_scanners.anonymize_helpers import BERT_LARGE_NER_CONF
from langfuse.openai import openai
from langfuse import observe
from llm_guard.output_scanners import Deanonymize
from llm_guard.vault import Vault
```

### 2. 匿名化、反匿名化并记录 Trace

把每个操作拆成独立函数，再用 `@observe()` 装饰，以便观察步骤及风险评分，检查是否按预期检测到 PII。

```python
vault = Vault()

@observe()
def anonymize(input: str):
  scanner = Anonymize(
      vault, preamble="Insert before prompt",
      allowed_names=["John Doe"], hidden_names=["Test LLC"],
      recognizer_conf=BERT_LARGE_NER_CONF, language="en"
  )
  sanitized_prompt, is_valid, risk_score = scanner.scan(input)
  return sanitized_prompt

@observe()
def deanonymize(sanitized_prompt: str, answer: str):
  scanner = Deanonymize(vault)
  sanitized_model_output, is_valid, risk_score = scanner.scan(
      sanitized_prompt, answer
  )
  return sanitized_model_output
```

::: info
上游原始示例中 `anonymize(input)` 的 `scanner.scan(prompt)` 引用了函数外变量 `prompt`。这里改为 `scanner.scan(input)` 以对应函数参数。实际运行仍应测试所选 LLM Guard 版本的 API。
:::

### 3. 对 LLM 调用埋点

采用 Langfuse 原生 OpenAI 集成，自动收集 Token 数、模型参数和发送给模型的实际提示词。其他框架如 LlamaIndex、LangChain、Haystack 也可集成。

```python
@observe()
def summarize_transcript(prompt: str):
  sanitized_prompt = anonymize(prompt)

  answer = openai.chat.completions.create(
      model="gpt-4o-mini",
      max_tokens=100,
      messages=[
          {"role": "system", "content": "Summarize the given court transcript."},
          {"role": "user", "content": sanitized_prompt}
      ],
  ).choices[0].message.content

  sanitized_model_output = deanonymize(sanitized_prompt, answer)
  return sanitized_model_output
```

### 4. 执行应用

例子输入一段法庭记录。处理敏感数据的应用常需要匿名化及反匿名化，以满足 HIPAA、GDPR 等数据隐私要求。

```python
prompt = """
Plaintiff, Jane Doe, by and through her attorneys, files this complaint
against Defendant, Big Corporation, and alleges upon information and belief,
except for those allegations pertaining to personal knowledge, that on or about
July 15, 2023, at the Defendant's manufacturing facility located at 123 Industrial Way, Springfield, Illinois, Defendant negligently failed to maintain safe working conditions,
leading to Plaintiff suffering severe and permanent injuries. As a direct and proximate
result of Defendant's negligence, Plaintiff has endured significant physical pain, emotional distress, and financial hardship due to medical expenses and loss of income. Plaintiff seeks compensatory damages, punitive damages, and any other relief the Court deems just and proper.
"""
summarize_transcript(prompt)
```

### 5. 在 Langfuse 中检查 Trace

[公开示例 Trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/43213866-3038-4706-ae3a-d39e9df459a2)中可以看到原告姓名发送模型前被匿名化，并在返回响应中恢复。这些数据可进一步用于评估安全措施。

[观看 PII 脱敏演示](https://static.langfuse.com/docs-videos/security-pii-redaction.mp4)。

## 更多示例

参阅 [LLM 安全监控 Cookbook](https://langfuse.com/guides/cookbook/example_llm_security_monitoring)。

## 常见问题

### 什么是 LLM Guard？

[LLM Guard](https://llm-guard.com) 是 Protect AI 的开源安全库，包括输入扫描器（提示词注入检测、PII 匿名化、毒性检测、话题禁止）和输出扫描器（内容审核、偏见检测、恶意 URL 检测、反匿名化）。可将它与 Langfuse 集成，追踪和监测检查效果。

### 什么是 LLM 防护栏？

防护栏是在应用层拦截、过滤输入输出的保护措施，包括输入防护、输出防护、PII 检测与脱敏、内容过滤、话题限制。它们是模型级安全训练的补充。

### 如何防止提示词注入？

采用多层防护：使用 LLM Guard 或 Lakera 识别和拦截恶意输入；明确区分系统指令和用户输入；在生产环境中通过 Langfuse 追踪注入事件；使用自动评估发现可疑模式。任何单一措施都无法保证 100% 防护，应采用纵深防御并持续监控。

### 如何在生产中监测 LLM 安全？

通过 Langfuse 追踪整个安全检查流程；用 LLM-as-a-Judge 对毒性、PII 泄露和提示词注入打分；用自定义 Dashboard 监测趋势；用标注队列人工检查被标记的交互；同时监控检查耗时，平衡安全与用户体验。

官方动态 GitHub Discussions 未嵌入。

---

原文：[LLM Security & Guardrails](https://langfuse.com/docs/security-and-guardrails) · 非官方中文翻译。
