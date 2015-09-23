title: 项目测试
categories:
-  test
tags:
-  test
-  amd
-  jasmine
-  istanbul
layout:
    layout
date:
    2015-09-23
---

EDP 默认支持浏览器端 [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) 项目的 BDD 测试，支持 [Jasmine](http://jasmine.github.io/) 的语法，对于代码覆盖率使用 [istanbul](https://github.com/gotwarlost/istanbul)，配合 [WebServer](/edp/doc/webserver/start-server/)，能大大降低项目的测试门槛。


## 初始化配置

> $ edp test init

EDP 将在 **test** 目录下创建 **config.js** 文件，默认配置的模板内容如下：

```javascript
// Test configuration for edp-test
// Generated on %DATE%
module.exports = {

    // base path, that will be used to resolve files and exclude
    basePath: '../',


    // frameworks to use
    frameworks: ['jasmine', 'esl'],


    // list of files / patterns to load in the browser
    files: [
        'test/**/*Spec.js'
    ],


    // optionally, configure the reporter
    coverageReporter: {
        // text-summary | text | html | json | teamcity | cobertura | lcov
        // lcovonly | none | teamcity
        type : 'text|html',
        dir : 'test/coverage/'
    },

    // web server port
    port: 8120,


    // enable / disable watching file and executing tests whenever any file changes
    watch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - Firefox
    // - Opera
    // - Safari
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
        // 'Chrome',
        // 'Firefox',
        // 'Safari',
        'PhantomJS'
    ],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,


    // Custom HTML templates
    // context | debug | runner
    templates: {
        // context: 'context.html'
    }
};
```

### 注意事项

- 默认匹配到的 Spec 文件名为 test 目录下的所有文件名以 **Spec.js** 结尾的文件，如果你的 Spec 命名模式不符可修改 `files` 项的配置。
- 默认将使用 [PhantomJS](https://github.com/Medium/phantomjs) 来运行测试，需要确认已经安装。
- 默认使用的 **Jasmine** 版本为 **1.3.1**，要使用 **2.0.0** 需要配置 `frameworks` 中的 `jasmine` 为 `jasmine2`。
- 默认使用的 **AMD** 实现为 [ESL](https://github.com/ecomfe/esl)。
- 如果项目使用了旧版的 `edp-test`，或已经存在 **test/config.js**，会提示是否覆盖，除非使用 `--force` 参数强制覆盖。


## 开始测试

编写完 Spec 之后，确认 **test/config.js** 配置无误，就可以通过以下命令开始测试了：

> $ edp test start
> $ edp test start
> $ edp test start [--singleRun]
> $ edp test start [--singleRun true]
> $ edp test start [--singleRun false]
> $ edp test start [--watch]
> $ edp test start [--watch true]
> $ edp test start [--watch false]

[EMC](https://github.com/ecomfe/emc) 项目的测试输入如下：

```
edp INFO Build runner...
edp INFO Runner build.
edp INFO Test port 8120...
edp INFO Port 8120 available

edp INFO EDP WebServer start, http://192.168.199.187:8120
edp INFO root = [/Users/chris/sites/ecomfe/emc], listen = [8120]
edp INFO Chrome 45.0.2454 (Mac OS X 10.10.2) - 6ca0t8 connected.

edp INFO PhantomJS 1.9.8 (Mac OS X) - jik9h6 connected.
PhantomJS 1.9.8 (Mac OS X)：Executed 100 % (128 / 128)
PhantomJS 1.9.8 (Mac OS X):
    edp test [SUCCESS] TOTAL: 0 SKIP, 128 SUCCESS

----------|-----------|-----------|-----------|-----------|
File      |   % Stmts |% Branches |   % Funcs |   % Lines |
----------|-----------|-----------|-----------|-----------|
----------|-----------|-----------|-----------|-----------|
All files |       100 |       100 |       100 |       100 |
----------|-----------|-----------|-----------|-----------|
Chrome 45.0.2454 (Mac OS X 10.10.2)：Executed 100 % (128 / 128)
Chrome 45.0.2454 (Mac OS X 10.10.2):
    edp test [SUCCESS] TOTAL: 0 SKIP, 128 SUCCESS

----------|-----------|-----------|-----------|-----------|
File      |   % Stmts |% Branches |   % Funcs |   % Lines |
----------|-----------|-----------|-----------|-----------|
----------|-----------|-----------|-----------|-----------|
All files |       100 |       100 |       100 |       100 |
----------|-----------|-----------|-----------|-----------|
```

上面的输出中省去了二维码的显示，可以通过配置文件中的 `qrcode` 来打开或关闭。

### ES6 代码的测试

由于目前（截止至 2015-9-23）对 ES6 的支持主要依赖 [babel](http://babeljs.io/) 的预处理，所以对于此类项目代码的测试支持，主要配置在 `WebServer` 的配置文件 **edp-webserver-config.js**。典型的 ES6 项目关键配置如下：


```javascript
var BABEL_OPTIONS = {
  loose: 'all',

  // 指定生成 AMD 的模块，edp-test 不支持非 AMD 模块的测试
  modules: 'amd',
  compact: false,
  ast: false,
  blacklist: ['strict'],
};

exports.getLocations = function () {
    return [
        {
            // 标识为需预处理的源码，edp-test 会对测试结果使用 sourcemap 映射源码
            key: 'source',
            location: /^\/src\/.+\.js(\?.+)?/,
            handler: [
                file(),

                babel(BABEL_OPTIONS)
            ]
        },
        {
            // 这里只匹配 Spec 文件，不需要配 key: 'source'
            // 如果 Spec 不是使用 ES6 编写，可以省略本段配置
            location: /^\/test\/.+\/*Spec\.js(\?.+)?/i,
            handler: [
                file(),
                babel(BABEL_OPTIONS)
            ]
        },
        {
            location: /^.*$/,
            handler: [
                file()
            ]
        }
    ];
};
```

### 注意事项

- babel 的配置项 `modules` 必须设为 'amd'，并且生成 **sourcemap**（WebServer 的 babel handler 已自动处理）。
- `getLocations` 数组的项中，使用 `key: 'source'` 标识当前路径为需要预处理的源码，`edp-test` 将根据生成的 sourcemap 来映射编译后的代码与源码的关系，主要体现在代码覆盖率的展示。
- 仅当 Spec 也使用 ES6 编写需要 babel 编译时才需要第二项配置，并且该项配置不需要指定 `key: 'source'`，否则 Spec 代码也被 istanbul 插入统计代码，导致 test case 不通过时调试代码行无法对应上源码的问题。



