title: 启动WebServer
categories:
- webserver
tags:
-  webserver
-  start
layout:
   layout
date:
    2015-01-10
---


EDP自带了一个小型的`WebServer`，用于前端开发时的调试工作。

注意：该`WebServer`设计时并未充分考虑抗压性和健壮性， **不得** 用于线上服务。


通过下面的命令，将根据默认的配置文件，启动`WebServer`。在`默认`情况下，`WebServer`使用`8848`端口，并且将`当前目录`做为DocumentRoot。

```
$ edp webserver start

edp INFO EDP WebServer start, http://192.168.1.105:8848
edp INFO root = [/Users/errorrik/test], listen = [8848]
```

在Linux/Mac环境下，可以使用`edp webserver start &`，使其在后台运行，以便可以继续使用命令行。通过`jobs -l`命令可以查看哪些东西在后台运行。

# 指定监听端口

通过`--port`参数，可以指定`WebServer`的监听端口。

```
$ edp webserver start --port 8888

edp INFO EDP WebServer start, http://192.168.1.105:8888
edp INFO root = [/Users/errorrik/test], listen = [8888]
```

# 指定WebServer配置文件

通过`--config`参数，可以指定`WebServer`的配置文件。

```
$ edp webserver start --config=ws-config.js

edp INFO EDP WebServer start, http://192.168.1.105:8898
edp INFO root = [/Users/cire/tttt/src], listen = [8898]
```
