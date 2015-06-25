title: CSS 代码检查
categories:
- lint
tags:
-  check
-  lint
-  hint
-  css
layout:
    layout
date:
    2015-06-06
---

EDP 内置 [FECS](https://github.com/ecomfe/fecs)，而 `FECS` 通过封装的 `csshint` 实现对 `css` 文件的检查。通过 `csslint` 命令：`edp csslint` 或 `edp lint --type=css`，能够对 `当前目录` 下所有 `css` 文件的代码进行检查。

注意，目前 EDP 的代码检查并没有使用 `csslint`，只是为了兼容旧版才保留 `csslint` 命令。更多信息，移步 [fecs.wiki](https://github.com/ecomfe/fecs/wiki)

```
$ edp csslint
edp INFO page.css
edp WARN → line 4, col 10: Values of 0 shouldn't have units specified.
edp WARN → line 7, col 1: Rule is empty.
edp WARN → line 8, col 1: Rule is empty.
```

## 自定义配置

EDP 默认使用 [`csshint` 的配置](https://github.com/ecomfe/fecs/blob/master/lib/css/csshint.json)，如果想使用自己的检测配置，可以在 `当前目录` 下建立 `.fecsrc`文件。该文件是 JSON 格式，其中相关参数将与默认参数 mixin。具体参数的含义请参考 <https://github.com/ielgnaw/node-csshint/blob/master/lib/config.js>。

下面是一个`.fecsrc`的简单例子：

```json
{
    "csshint": {
        "no-bom": true,
        "block-indent": true,
        "require-before-space": ["{"],
        "require-after-space": [":", ","],
    }
}
```

如果有的 css 文件比较特殊，可以在文件顶部内容中，通过注释的形式，单独设置检查该文件时是否禁止的规则。

```css
/* csshint-disable require-before-space,require-newline property-not-existed*/
```

## 排除检测文件

有时我们想要排除一些文件，不期望这些文件被检测：比如数据模拟、测试用例、工具代码。这时我们可以在 `当前目录` 下建立 `.fecsignore` 文件。

`.fecsignore` 中，每一行是一个 pattern。其逻辑与`gitignore`一致，详细说明请参看`man 5 gitignore`。

```
**/tool/**
**/doc/**
```

提示：`bower_components`、`node_module` 目录已经被自动排除。
