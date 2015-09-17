title: 通过web使用
categories:
- initialization
tags:
-  init
layout:
    layout
date:
    2015-01-27
---

除了传统的通过命令行方式使用之外，EDP基于以下考虑，提供了Web的使用方式。

1. 为命令行使用不熟练的同学提供便利的使用方式。
2. 能在运行命令前清晰地看到命令支持的参数和完整的帮助信息。
3. 临时在开发机上调试和修改时，可以无需登录开发机。


想要通过Web方式使用EDP，首先需要在命令行下运行`edp web`命令：

```
$ edp web
edp INFO Edp Web start.
edp INFO Visit http://localhost:8008 or http://172.xx.xx.x:8008
edp INFO To stop, Press Ctrl+C
```

然后按照提示在浏览器中打开URL：

![](../../../img/web-desc.png)

在Web中运行命令时，console面板将自动打开，显示命令运行结果：

![](../../../img/web-console.png)

部分EDP扩展包提供了Web专属功能，针对Web界面的特性提供了更符合体验的功能和运行结果。

![](../../../img/web-lint.png)






