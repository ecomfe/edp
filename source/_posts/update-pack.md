title: 升级已导入的包
categories:
- package-management
tags:
-  package
layout:
    layout
date:
    2015-01-22
---

通过edp的`update`命令：`edp update [package]`，可以对使用`import`命令导入过的包进行升级。

## 升级指定包

如果当前使用的包不是最新版，想升级到最新版，可以使用`edp update package`。

为了防止对用户对第三方包手工修改的删除，升级过程将进行用户确认。但我们依然要强调：`dep`和`dep/packages.manifest`不建议手工修改。

```
$ edp update etpl

info trying registry request attempt 1 at 18:55:53
http GET http://registry.edp.baidu.com/etpl
http 304 http://registry.edp.baidu.com/etpl
etpl - current version: 2.0.8, will update to version: 2.1.0
Continue update? [Y/n]y
info trying registry request attempt 1 at 18:56:06
http GET http://registry.edp.baidu.com/etpl
http 304 http://registry.edp.baidu.com/etpl
info trying registry request attempt 1 at 18:56:06
http GET http://registry.edp.baidu.com/etpl/2.1.0
http 304 http://registry.edp.baidu.com/etpl/2.1.0

$ ls dep/etpl

2.1.0
```

## 升级所有包

不指定`package`，使用`edp update`可以根据已导入包的依赖信息，升级所有导入的包。

如果当前开发的`项目`是一个包，升级过程将使用`package.json`中声明的依赖信息。

如果通过edp提供的[项目管理功能](../../../doc/project-management/init-proj/)来管理`项目`，已导入包的依赖信息保存在`.edpproj/metadata`文件中。

```
$ edp update

info trying registry request attempt 1 at 19:15:30
http GET http://registry.edp.baidu.com/er
http 304 http://registry.edp.baidu.com/er
er - Current dependence `er` does not exist, will update to version: 3.1.0-alpha.8
Continue update? [Y/n]y
......
esui - Current dependence `esui` does not exist, will update to version: 3.1.0-alpha.8
Continue update? [Y/n]y
......

$ ls dep

er    esui    etpl    mini-event    moment    packages.manifest    underscore
```