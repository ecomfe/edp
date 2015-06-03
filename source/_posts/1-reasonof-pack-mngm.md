title: 为什么要进行包管理
categories:
- package-management
tags:
-  package
layout:
    layout
date:
    2015-01-23
---


通常我们在开发一个项目时，都会使用一些第三方开发的library，比如underscore、moment.js、hogan、er、echarts、esui、etpl等。而不同的library可能以不同的方式编写和提供，使用的方式也不同。

我们认为，可被复用的代码集或功能集，都应该以一致的方式编写和声明，并且发布到云端的仓库中。这样能够减少使用者的了解与学习成本，并且能够通过工具来管理。为此，EFE团队：

- 在AMD的基础上制定了[模块和加载器规范](https://github.com/ecomfe/spec/blob/master/module.md)
- 在COMMONJS Package的基础上制定了[包结构规范](https://github.com/ecomfe/spec/blob/master/package.md)

遵循以上规范的可复用的代码集，可以做为一个包，发布到[registry](http://edp-registry.baidu.com/)，并且通过edp提供的包管理功能进行管理。

未遵循以上规范的第三方library，可以通过针对性的封装，使其遵循规范，并发布。大多数流行library都考虑了AMD的使用模式，通常只需要将其放在相应的目录结构下，并增加包声明文件`package.json`，即可。