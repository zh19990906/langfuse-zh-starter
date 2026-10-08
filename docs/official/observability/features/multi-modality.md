---
title: 多模态与附件
description: 多模态媒体支持、上传、引用解析、隐私与对象存储配置。
---

# 多模态与附件

Langfuse 可以记录文本以外的输入输出，例如图像、音频、文档和其他媒体。媒体数据与 Trace、Observation 关联，便于调试多模态 Agent 与模型调用。

## 可用性

Cloud 提供托管媒体存储。自托管环境需要配置相应的对象存储服务、访问权限以及公开或签名 URL。

## 支持的媒体格式

SDK 可以识别受支持的媒体内容，并将媒体实体从结构化 JSON 中提取、上传后以引用表示。格式、大小上限、上传路径应对照原文和实际 SDK 版本核对。

## 快速开始

### Base64 Data URI

可以在 Input 或 Output 中使用 `data:<mime>;base64,...` 形式表示媒体，SDK 在支持的路径自动提取上传。对于大型文件，请留意内存与带宽成本。

### 外部 URL

**外部媒体 URL：官方示例**

```md
![Alt text](https://example.com/image.jpg)
```

```json
{
  "content": [
    {
      "role": "system",
      "content": "You are an AI trained to describe and interpret images. Describe the main objects and actions in the image."
    },
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "What's happening in this image?"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "https://example.com/image.jpg"
          }
        }
      ]
    }
  ]
}
```


也可保留外部可访问的媒体 URL。媒体是否能在 UI 中预览取决于跨域、认证和 URL 的有效期。

### LLM-as-a-Judge

多模态评估器可读取合适的媒体引用，比较图文、音频等输入与输出，前提是评估模型和变量映射支持该格式。

### 自定义附件

**自定义媒体对象：官方示例**

```python
from langfuse import get_client, observe, propagate_attributes
from langfuse.media import LangfuseMedia

# Create a LangfuseMedia object from a file

with open("static/bitcoin.pdf", "rb") as pdf_file:
pdf_bytes = pdf_file.read()

# Wrap media in LangfuseMedia class

pdf_media = LangfuseMedia(content_bytes=pdf_bytes, content_type="application/pdf")

# Using with the decorator

@observe()
def process_document():
    langfuse = get_client()

    # Propagate metadata (including media) to all child observations
    with propagate_attributes(
        metadata={"document": pdf_media}
    ):
        pass

    # Or update the current observation
    langfuse.update_current_span(
        input={"document": pdf_media}
    )

# Using with context managers

langfuse = get_client()

with langfuse.start_as_current_observation(as_type="span", name="analyze-document") as span: # Include media in the span input, output, or metadata
    span.update(
        input={"document": pdf_media},
        metadata={"file_size": len(pdf_bytes)}
    )

    # Process document...

    # Add results with media to the output
    span.update(output={
        "summary": "This document explains Bitcoin...",
        "original": pdf_media
    })

```

```typescript
import fs from "fs";
import { LangfuseMedia } from "@langfuse/core";

// Wrap media in LangfuseMedia class
const wrappedMedia = new LangfuseMedia({
  source: "bytes",
  contentBytes: fs.readFileSync(new URL("./bitcoin.pdf", import.meta.url)),
  contentType: "application/pdf",
});

// Optionally, access media via wrappedMedia.obj
console.log(wrappedMedia.obj);

// Include media in any trace or observation
const span3 = startObservation("media-pdf-generation");

const generation3 = span3.startObservation('llm-call', {
  model: 'gpt-4',
  input: wrappedMedia,
}, {asType: "generation"});

generation3.end();

span3.end();
```


Python 的 `LangfuseMedia` 可以把文件或二进制内容包装成追踪属性。相关使用方法在下方代码示例中保留。

## API 上传与媒体引用

自建集成可使用媒体上传 API，再在 Trace/Observation 的 JSON 内容中保存媒体引用；不要把长期有效的私有对象存储 Key 直接放在 Trace 字段中。

## 媒体处理流程

SDK 会识别媒体、读取内容、执行安全与上传处理，最终在 Trace 内容中保存一个可解析的媒体引用。前端通过受控或签名 URL 获取媒体，需注意 URL 过期和对象存储权限。

## 引用解析

**媒体引用格式与解析：官方示例**

```
@@@langfuseMedia:type={MIME_TYPE}|id={LANGFUSE_MEDIA_ID}|source={SOURCE_TYPE}@@@
```

```python
from langfuse import get_client

# Initialize Langfuse client
langfuse = get_client()

# Example object with media references
obj = {
    "image": "@@@langfuseMedia:type=image/jpeg|id=some-uuid|source=bytes@@@",
    "nested": {
        "pdf": "@@@langfuseMedia:type=application/pdf|id=some-other-uuid|source=bytes@@@"
    }
}

# Resolve media references to base64 data URIs
resolved_obj = langfuse.resolve_media_references(
    obj=obj,
    resolve_with="base64_data_uri"
)

# Result:
# {
#     "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
#     "nested": {
#         "pdf": "data:application/pdf;base64,JVBERi0xLjcK..."
#     }
# }
```

```python
from langfuse import Langfuse

# Initialize Langfuse client
langfuse = Langfuse()

# Example object with media references
obj = {
    "image": "@@@langfuseMedia:type=image/jpeg|id=some-uuid|source=bytes@@@",
    "nested": {
        "pdf": "@@@langfuseMedia:type=application/pdf|id=some-other-uuid|source=bytes@@@"
    }
}

# Resolve media references to base64 data URIs
resolved_trace = langfuse.resolve_media_references(
    obj=obj,
    resolve_with="base64_data_uri"
)

# Result:
# {
#     "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
#     "nested": {
#         "pdf": "data:application/pdf;base64,JVBERi0xLjcK..."
#     }
# }
```

```typescript
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient()

// Example object with media references
const obj = {
  image: "@@@langfuseMedia:type=image/jpeg|id=some-uuid|source=bytes@@@",
  nested: {
    pdf: "@@@langfuseMedia:type=application/pdf|id=some-other-uuid|source=bytes@@@",
  },
};

// Resolve media references to base64 data URIs
const resolvedTrace = await langfuse.resolveMediaReferences({
  obj: obj,
  resolveWith: "base64DataUri",
});

// Result:
// {
//     image: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
//     nested: {
//         pdf: "data:application/pdf;base64,JVBERi0xLjcK..."
//     }
// }
```


API 或 SDK 读取内容后，可将媒体引用转换成 Base64 Data URI 用于下游模型和数据集实验。转换可能涉及网络读取，大规模数据应控制并发与大小。

## 外部 S3 媒体

**S3 CORS 与媒体 URL：官方示例**

```json
[
  {
    "AllowedHeaders": ["Range"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["https://cloud.langfuse.com"],
    "ExposeHeaders": [
      "Accept-Ranges",
      "Content-Length",
      "Content-Range",
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <CORSRule>
    <AllowedOrigin>https://cloud.langfuse.com</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>Range</AllowedHeader>
    <ExposeHeader>Accept-Ranges</ExposeHeader>
    <ExposeHeader>Content-Length</ExposeHeader>
    <ExposeHeader>Content-Range</ExposeHeader>
    <ExposeHeader>ETag</ExposeHeader>
    <MaxAgeSeconds>3600</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
```

```text
s3://media-bucket/path/image.png
```

```md
![Product image](s3://media-bucket/path/image.png)
```

```json
{
  "type": "image_url",
  "image_url": {
    "url": "s3://media-bucket/path/image.png"
  }
}
```


外部 S3 对象必须配置合理的 CORS、对象权限、来源及过期策略。不要把私有 Bucket 无限制公开，只为所需客户端和源授权。



::: info 校验状态
已根据原文将 13 组代码示例归位到对应章节，尚未完成所有动态组件、复杂表格、SDK 运行测试及全量构建的最终验收。
:::

原文：[官方文档](https://langfuse.com/docs/observability/features/multi-modality)。
