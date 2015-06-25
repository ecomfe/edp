title: 导入并使用包
categories:
- package-management
tags:
-  package
layout:
    layout
date:
    2015-01-21
---


在开发自己的`项目`时，如果想使用一些package，可以通过edp的`import`命令：`edp import <package>`，进行导入。导入包时，其依赖包也会被一并导入。

导入的包将存放在`项目`的`dep`目录下，下面的资料是[我们认为合理的前端项目的目录组织方式](https://github.com/ecomfe/spec/blob/master/directory.md)。

如果通过edp提供的[项目管理功能](../../../doc/project-management/init-proj/)来管理`项目`，可以在项目目录下的任何一个子目录中运行`edp import`。否则，请在`项目根目录`下运行`edp import`。

通过edp提供的[项目管理功能](../../../doc/project-management/init-proj/)来管理`项目`，导入包时将自动更新`html`文件中的加载器配置`require.config({...})`中的`packages`项。否则，在导入包后需要手工更新自己项目中的加载器配置。

如果不想更新某些`html`文件中的`require.config({...})`的配置信息，可以添加：

```html
<!--edp:{"loaderAutoConfig": false}-->
```

如果只想要更新`packages`的配置信息，但是不想更新`baseUrl`，可以添加：

```html
<!--edp:{"preserveBaseUrl": true}-->
```

# 导入包的最新版

直接输入package的名称，将导入当前存在的最新版本。

```
$ edp import etpl
info trying registry request attempt 1 at 17:29:50
http GET http://registry.edp.baidu.com/etpl
http 304 http://registry.edp.baidu.com/etpl
info trying registry request attempt 1 at 17:29:50
http GET http://registry.edp.baidu.com/etpl/2.1.0
http 304 http://registry.edp.baidu.com/etpl/2.1.0

$ ls dep/etpl
2.1.0
```

# 导入指定版本的包

输入`edp import package@version`，可以导入指定版本的包。

```
$ edp import etpl@2.0.8
info trying registry request attempt 1 at 17:32:02
http GET http://registry.edp.baidu.com/etpl
http 304 http://registry.edp.baidu.com/etpl
info trying registry request attempt 1 at 17:32:02
http GET http://registry.edp.baidu.com/etpl/2.0.8
http 200 http://registry.edp.baidu.com/etpl/2.0.8

$ ls dep/etpl
2.0.8
```