title: 构建过程
categories:
- Build
tags:
-  build
layout:
    layout
date:
    01-16
---

EDP的构建过程分成3步：

1. 输入：读入指定的`input`目录下的所有文件，`input`通过配置文件指定。
2. 处理：使用配置的`processors`对所有读入的文件内容进行处理。
3. 输出：将处理结果输出到`output`目录中，`output`可以通过配置文件指定，也可以通过`--output`参数传入。

![Build Process](Build-Process.png)

