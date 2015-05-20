title: CSS代码检测
categories:
- Lint
tags:
-  webserver start
-  css
layout:
    layout
date:
    01-12
---


EDP内置并封装了`csslint`工具，通过`csslint`命令：`edp csslint`，能够对`当前目录`下所有`css`文件的代码进行检测。

```
$ edp csslint

edp INFO page.css
edp WARN → line 4, col 10: Values of 0 shouldn't have units specified.
edp WARN → line 7, col 1: Rule is empty.
edp WARN → line 8, col 1: Rule is empty.
```

# 自定义csslint配置

EDP自定义了一套`csslint`的配置，如果想使用自己的检测配置，可以在`当前目录`下建立`.csslintrc`文件。该文件是一个JSON文件，其中相关参数将与默认参数mixin。具体参数的含义请参考[CSSLint Rules](https://github.com/stubbornella/csslint/wiki/Rules)。

下面是一个`.csslintrc`的简单例子：

```json
{
    "empty-rules": 0
}
```

# 排除检测文件

有时我们想要排除一些文件，不期望这些文件被检测：比如测试页面用的CSS。这时我们可以在`当前目录`下建立`.csslintignore`文件。

`.csslintignore`中，每一行是一个pattern。其逻辑与`gitignore`一致，详细说明请参看`man 5 gitignore`。

```
**/tool/**
**/doc/**
```

提示：`test`、`output`、`node_module`、`asset`、`dist`、`release`、`doc`、`dep`目录已经被自动排除。
