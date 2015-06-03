title: Javascript代码检测
categories:
- lint
tags:
-  check
-  javascript
layout:
    layout
date:
    2015-01-13
---

EDP内置并封装了`jshint`和`jscs`，通过`jshint`命令：`edp jshint`或`edp lint --type=js`，能够对`当前目录`下所有`js`文件的代码进行检测。

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

# 自定义jshint配置

EDP自定义了一套`jshint`的[配置](https://github.com/ecomfe/edp-lint/blob/master/lib/js/config.js)和`jscs`的[配置](https://github.com/ecomfe/edp-lint/blob/master/lib/js/jscsrc.json)，如果想使用自己的检测配置，可以在`当前目录`下建立`.jshintrc`和`.jscsrc`文件。该文件是JSON格式，其中相关参数将与默认参数mixin。具体参数的含义请参考[JSHint Options](http://jshint.org/docs/options/)和[JSCS Options](https://github.com/jscs-dev/node-jscs/blob/master/README.md#options)。

下面是一个`.jshintrc`的简单例子：

```json
{
    "eqeqeq": false,
    "maxlen": 100
}
```

如果有的js文件比较特殊，可以在文件内容中，通过注释的形式，单独设置检查该文件时的一些特殊参数。

```javascript
// 有的正则比较长，有的判断没必要，所以特别放开一些限制
/* jshint eqeqeq: false, maxlen: 150 */


// forin 规则有时会误报
/* jshint forin: false */
for (var key in obj) {
    if (!obj.hasOwnProperty(key)) {
        continue;
    }
    // 用 Object.prototype.hasOwnProperty.call(obj, key); 也会误报

    // statements
}
```

jscs的形式为：

```javascript
// 有时为了便于阅读 JSON 格式的数据，居于冒号对齐，允许键名后有空格
/* jscs: disable disallowSpaceAfterObjectKeys */

// 同scope中可以再恢复回来
/* jscs: enable disallowSpaceAfterObjectKeys */
```

# 排除检测文件

有时我们想要排除一些文件，不期望这些文件被检测：比如数据模拟、测试用例、工具代码。这时我们可以在`当前目录`下建立`.jshintignore`文件。

`.jshintignore`中，每一行是一个pattern。其逻辑与`gitignore`一致，详细说明请参看`man 5 gitignore`。

```
**/tool/**
**/doc/**
```

提示：`test`、`output`、`node_module`、`asset`、`dist`、`release`、`doc`、`dep`目录已经被自动排除。