title: 初始化项目
categories:
- project-management
tags:
-  project management
-  init
layout:
    layout
date:
    2015-01-21
---


在当前目录下，通过edp命令：`edp project init`，可以将当前目录初始化成一个`项目目录`。

```
$ mkdir myProject && cd myProject

$ edp project init

$ ls -la

total 24
drwxr-xr-x   11 erik  staff   374  4  2 10:57 .
drwxr-xr-x+ 108 erik  staff  3672  4  2 10:57 ..
drwxr-xr-x    3 erik  staff   102  4  2 10:57 .edpproj
drwxr-xr-x    2 erik  staff    68  4  2 10:57 dep
drwxr-xr-x    2 erik  staff    68  4  2 10:57 doc
-rw-r--r--    1 erik  staff  1764  4  2 10:57 edp-build-config.js
-rw-r--r--    1 erik  staff  1371  4  2 10:57 edp-webserver-config.js
-rw-r--r--    1 erik  staff    61  4  2 10:57 module.conf
drwxr-xr-x    2 erik  staff    68  4  2 10:57 src
drwxr-xr-x    2 erik  staff    68  4  2 10:57 test
drwxr-xr-x    2 erik  staff    68  4  2 10:57 tool
```

可见，`edp project init`将自动生成[我们认为合理的前端项目的目录结构](https://github.com/ecomfe/spec/blob/master/directory.md)，`dep`、`doc`、`src`、`test`、`tool`目录的相关作用请参看上面的文档。其它几个特殊的东西的说明如下：

+ `.edpproj` 用于保存项目相关信息
+ `edp-build-config.js` 项目构建的配置模块，更详细信息请参考[构建你的项目](../../../doc/build/build/)
+ `edp-webserver-config.js` 调试服务器的配置模块，更详细信息请参考[使用调试服务器](../../../doc/webserver/start-server/)
+ `module.conf` 项目的AMD模块配置，`html`中的`require.config`将从此处同步更新，build过程module compile也将使用此配置



`项目目录`不允许嵌套。如果当前目录已经位于一个`项目目录`内，则初始化将失败。

```
$ edp project init

edp ERROR [edp project init] Project is already inited in /Users/userName/myProject
```