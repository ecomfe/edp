EDP
==========

EDP是一个企业级前端应用的开发平台，提供了常用的项目管理工具、包管理工具、调试工具、构建工具、脚手架、代码检测工具等一系列工具，并允许用户自定义自己的工具。


安装
-------

edp已经发布到npm上，可以通过下面的npm命令安装。`-g`选项是必须选项，使用`-g`全局安装后，可以获得command line的`edp`命令。

    $ [sudo] npm install -g edp

全局安装可能需要`sudo`。


文档
------

我们推荐通过命令行的方式使用edp。直接命令行下执行edp将显示可以调用的命令，包含内建命令和用户定制的命令。

    $ edp
    Usage: edp <command> [<args>]

    Builtin Commands:
    addhtml, addjs, config, help, import, jshint, project, search, webserver

    User Commands:
    er

    See "edp help <command>" for more information.

更详细的使用说明请参考下面的文档：

- [项目管理](doc/project.md)
- [包管理](doc/pm.md)
