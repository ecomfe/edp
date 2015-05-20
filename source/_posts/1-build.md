title: 构建一个项目
categories:
- Build
tags:
-  build
layout:
    layout
date:
    01-17
---


通常，一个前端项目从开发环境到线上环境，需要进行一系列的构建处理过程：Less编译、文件合并、JS压缩、添加版本信息等。EDP提供了相应的`Build`工具，用于进行`项目构建`。

通过以下命令，可以构建一个项目。

```
$ edp build
```

# 指定输出目录

默认的构建结果`输出目录`是当前目录下的`output`目录。如果想要修改`输出目录`，可以通过`--output`或者`-o`参数指定。

```
$ edp build --output ../myproject-dist
```

# 强制覆盖

如果`输出目录`已经存在，构建过程将不会继续。如果想要强制覆盖当前`输出目录`下的内容，可以通过`-f`参数。指定该参数后，构建前将清空`输出目录`下所有文件，请大家小心。

```
$ edp build -f
```

# 指定构建配置文件

默认的构建`配置文件`为当前目录下的`edp-build-config.js`。`配置文件`是一个暴露相关指定属性和方法的`node module`，可以通过`--config`参数指定。

```
$ edp build --config my-build-conf.js
```
