title: HTML代码检测
categories:
- Lint
tags:
-  webserver start
-  html
layout:
    layout
date:
    01-11
---

EDP内置并封装了`htmlhint`工具，通过`htmlhint`命令：`edp htmlhint`，能够对`当前目录`下所有`html`文件的代码进行检测。

```
$ edp htmlhint

edp INFO index.html
edp WARN → line 7, col 3: INCORRECT_CLOSE_TAG_ORDER: head
edp WARN → line 25, col 27: UNUNIQUE_ID: try-nav
```


# 排除检测文件

有时我们想要排除一些文件，不期望这些文件被检测：比如测试页面。这时我们可以在`当前目录`下建立`.htmlhintignore`文件。

`.htmlhintignore`中，每一行是一个pattern。其逻辑与`gitignore`一致，详细说明请参看`man 5 gitignore`。

```
**/tool/**
**/doc/**
```

提示：`test`、`output`、`node_module`、`asset`、`dist`、`release`、`doc`、`dep`目录已经被自动排除。

