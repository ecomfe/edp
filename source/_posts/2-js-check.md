title: JavaScript 代码检查
categories:
- lint
tags:
-  check
-  lint
-  hint
-  javascript
layout:
    layout
date:
    2015-06-06
---

EDP 内置 [FECS](https://github.com/ecomfe/fecs)，而 `FECS` 通过封装的 `eslint` 实现对 `js` 文件的检查。通过 `jshint` 命令：`edp jshint` 或 `edp lint --type=js`，能够对 `当前目录` 下所有 `js` 文件的代码进行检查。

注意，目录 EDP 的代码检查并没有使用 `jshint`，只是由于兼容旧版，保留了 `jshint` 的命令。更多信息，移步 [fecs.wiki](https://github.com/ecomfe/fecs/wiki)

```
$ edp jshint

edp INFO main.js
edp WARN → line 149, col 12: Strings must use singlequote.
edp WARN → line 529, col 9: Empty block.
edp WARN → line 1057, col 61: Expected a 'break' statement before 'case'.

edp INFO tpl.js
edp WARN → line 20, col 43: Expected '===' and instead saw '=='.
edp WARN → line 24, col 68: Expected '===' and instead saw '=='.
edp WARN → line 14, col 59: 'config' is defined but never used.
```

# 自定义配置

EDP 默认使用 [`FECS` 的配置](https://github.com/ecomfe/fecs/blob/master/lib/js/eslint.json)，如果想使用自己的检测配置，可以在 `当前目录` 下建立 `.fecsrc`文件。该文件是 JSON 格式，其中相关参数将与默认参数 mixin。具体参数的含义请参考[ESLint Rules](http://eslint.org/docs/rules/)。

下面是一个`.fecsrc`的简单例子：

```json
{
    "eslint": {
        "rules": {
            "fecs-valid-jsdoc": 0,
            "max-nested-callbacks": [1, 5]
        }
    }
}
```

如果有的 js 文件比较特殊，可以在文件内容中，通过注释的形式，单独设置检查该文件时的一些特殊参数。

```javascript
// 有的正则比较长，有的判断没必要，所以特别放开一些限制
/* eslint eqeqeq: 0, maxlen: 150 */


// 有的接口字段不符合 Camel 命名
/* eslint fecs-camelcase: [2, {ignore: ["/^api_/"]}] */

var json = {
    api_field1: 1,
    api_field2: 2
}

```

或者在某个代码段禁止该规则的检查：

```javascript
/* eslint-disable fecs-camelcase */

var json = {
    api_field1: 1,
    api_field2: 2
}

/* eslint-enable fecs-camelcase */
```

# 排除检测文件

有时我们想要排除一些文件，不期望这些文件被检测：比如数据模拟、测试用例、工具代码。这时我们可以在`当前目录`下建立`.fecsignore`文件。

`.fecsignore`中，每一行是一个pattern。其逻辑与`gitignore`一致，详细说明请参看`man 5 gitignore`。

```
**/tool/**
**/doc/**
```

提示：`bower_components`、`node_module` 目录已经被自动排除。
