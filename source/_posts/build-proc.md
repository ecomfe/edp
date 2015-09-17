title: 构建过程
categories:
- build
tags:
-  build
layout:
    layout
date:
    2015-01-18
---

EDP的构建过程分成3步：

1. 输入：读入指定的`input`目录下的需要处理的文件，`input`通过配置文件指定。`edp build`会扫描`input`目录下的所有文件，然后根据`配置文件`中定义的`exports.exclude`过滤掉不需要的文件，剩下的文件集合我们称作`BUILD_FILES`。

2. 处理：使用配置的`processors`对所有读入的文件内容进行处理。每个`Processor`在执行之前，需要从`BUILD_FILES`中选出它需要处理的文件。完成文件选择后，`Processor`将对`PROCESS_FILES`中的每个文件进行处理。

3. 输出：将处理结果输出到`output`目录中，`output`可以通过配置文件指定，也可以通过`--output`参数传入。

![Build Process](../../../img/build-process.png)

