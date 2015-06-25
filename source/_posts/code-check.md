title: 代码检测
categories:
- lint
tags:
-  check
layout:
    layout
date:
    2015-01-14
---
代码检测
===

EDP整合了一系列`静态检测`工具，能够对前端的`Javascript`、`HTML`、`CSS`代码进行检测。

注意：`静态检测`是衡量代码是否高质量的第一道门槛，只能检查出一些显而易见的、工程性欠妥的代码，不代表代码的逻辑是正确的，也无法检查代码结构和模块划分的合理性。

可以直接使用`edp lint`来检测当前目录下的所有`js`、`css`、`less`和`html`，也可以通过`--type`参数指定文件类型。