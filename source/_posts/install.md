title: 安装
categories:
- initialization
tags:
- init
layout:
    layout
date:
    2015-01-29
---


## npm install
EDP通过npm发布到npmjs.org上的。通过 

```
$ npm install -g   
```

命令可以进行安装。-g为全局安装参数，必选。 在Linux/Mac平台下，全局安装可能需要sudo。  
如果因为npmjs.org的不稳定导致无法安装成功，可以考虑下述两种方式。

## 使用cnpm安装
首先，安装cnpm：

```
$ [sudo] npm i cnpm -g --registry=http://r.cnpmjs.org
```

然后安装edp：

```
$ [sudo] cnpm i -g edp
```

## 使用内网npm镜像安装

内网的npm镜像是http://npm.internal.baidu.com ， 如果在公司内网下，使用这个镜像安装起来会很快。

```
$ npm config set registry http://npm.internal.baidu.com  
$[sudo] npm i -g edp edp-build edp-webserver
```

-------

安装成功后，可以通过下面的命令，检测当前edp的版本号。

```
$ edp -v  
edp@1.1.1 /Users/leeight/local/leeight.github.com/edp-cli/edp  
Builtin Commands:  
    ...  
User Commands:  
    ...
```