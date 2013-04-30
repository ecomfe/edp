代码生成
-------

edp默认提供了基础的代码生成功能。

在项目开发中，edp鼓励开发人员根据项目的特点，通过[自定义扩展](extension.md)，定制开发更符合项目需求的更详尽的代码生成工具。


addhtml
-------

`addhtml`命令可以添加一个HTML文件。如果添加的HTML文件位于`项目目录`下，将自动添加loader配置。

    $ edp addhtml index.html

addjs
-------

`addjs`命令可以添加一个Javascript文件。添加的Javascript文件是符合[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)的匿名模块。

    $ edp addjs conf.js
