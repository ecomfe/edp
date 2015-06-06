title: HTML 代码检查
categories:
- lint
tags:
-  check
-  lint
-  hint
-  html
layout:
    layout
date:
    2015-06-06
---

EDP 内置 [FECS](https://github.com/ecomfe/fecs)，而 `FECS` 通过封装的 `htmlcs` 实现对 `html` 文件的检查。通过 `htmlhint` 命令：`edp htmlhint` 或 `edp lint --type=html`，能够对 `当前目录` 下所有 `html` 文件的代码进行检查。

注意，目录 EDP 的代码检查并没有使用 `htmlhint`，只是由于兼容旧版，保留了 `htmlhint` 的命令。更多信息，移步 [fecs.wiki](https://github.com/ecomfe/fecs/wiki)


```
$ edp htmlhint

edp INFO index.html
edp  WARN → line 1, col 1: <meta http-equiv="X-UA-Compatible" content="IE=Edge"> recommended.
edp  WARN → line 6, col 5: Default value of attribute "type" ("text/css") does not need to be set.
edp  WARN → line 6, col 5: Attribute "rel" of <link> should be set as "stylesheet".
edp  WARN → line 7, col 5: Default value of attribute "type" ("text/javascript") does not need to be set.
edp  WARN → line 7, col 5: Javascript contents are recommended to be imported in the tail of <body>.
edp  WARN → line 8, col 5: Style tag can not be used.
edp  WARN → line 14, col 5: Default value of attribute "type" ("text/javascript") does not need to be set.
edp  WARN → line 14, col 5: Javascript contents are recommended to be imported in the tail of <body>.
```

# 自定义配置

EDP 默认使用 [`htmlcs` 的配置](https://github.com/ecomfe/fecs/blob/master/lib/html/htmlcs.json)，如果想使用自己的检测配置，可以在 `当前目录` 下建立 `.fecsrc`文件。该文件是 JSON 格式，其中相关参数将与默认参数 mixin。具体参数的含义请参考 <https://github.com/ecomfe/htmlcs/blob/master/lib/default/htmlcsrc.json>。

下面是一个`.fecsrc`的简单例子：

```json
{
    "htmlcs": {
        "html-lang": false
    }
}
```

如果有的 html 文件比较特殊，可以在文件顶部内容中，通过注释的形式，单独设置检查该文件时是否禁止的规则。

```html
<!--htmlcs-disable asset-type -->
```


# 排除检测文件

有时我们想要排除一些文件，不期望这些文件被检测：比如数据模拟、测试用例、工具代码。这时我们可以在`当前目录`下建立`.fecsignore`文件。

`.fecsignore`中，每一行是一个pattern。其逻辑与`gitignore`一致，详细说明请参看`man 5 gitignore`。

```
**/tool/**
**/doc/**
```

提示：`bower_components`、`node_module` 目录已经被自动排除。
