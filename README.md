EDP
==========

[![Dependencies Status](https://david-dm.org/ecomfe/edp.png)](https://david-dm.org/ecomfe/edp)

EDP是一个企业级前端应用的开发平台，提供了常用的项目管理工具、包管理工具、调试工具、构建工具、代码生成工具、代码检测工具等一系列开发时的支持，并允许用户自定义自己的扩展。


安装与更新
-------

edp已经发布到npm上，可以通过下面的npm命令安装。`-g`选项是必须选项，使用`-g`全局安装后，可以获得command line的`edp`命令。在Linux/Mac平台下，全局安装可能需要`sudo`。

    $ [sudo] npm install -g edp

如果想要升级当前edp的版本，请运行如下命令。在Linux/Mac平台下，升级可能需要`sudo`。

    $ [sudo] npm update -g edp

准备
------

在使用之前，您需要先配置下个人的名字和邮箱。方法如下：(请替换掉`[]`部分)

    $ edp config user.name [your_name]
    "user.name" is setted.

    $ edp config user.email [your_email@example.com]
    "user.email" is setted.


使用
------

我们推荐通过命令行的方式使用edp。直接命令行下执行edp将显示可以调用的命令，包含内建命令和用户定制的命令。

    $ edp
    Usage: edp <command> [<args>] [<options>]

    Builtin Commands:

    addhtml         添加html文件
    addjs           添加javascript文件
    beautify        格式化JS、CSS和JSON文件
    build           构建目录或项目
    config          读取和设置edp用户配置
    csslint         使用csslint检测当前目录下所有CSS文件
    extension       扩展管理相关功能
    help            显示帮助信息
    htmlhint        使用htmllint检测当前目录下所有HTML文件
    import          导入包
    jshint          使用jshint检测当前目录下所有Javascript文件
    minify          使用minify命令来让js、css、json文件获得最小化的输出
    project         项目管理相关功能
    search          查询现有的包
    update          更新依赖包
    webserver(ws)   用于开发时调试的WebServer

    User Commands:
    riaproject

    See "edp help <command>" for more information.


`--version`将显示当前EDP的版本号。

    $ edp --version
    edp version 0.6.0


命令手册
------

在命令行下，我们可以通过`edp help <command>`查看命令的帮助信息。也可以通过下面的链接查看命令帮助：

- [addhtml](doc/cli/addhtml.md)
- [addjs](doc/cli/addjs.md)
- [beautify](doc/cli/beautify.md)
- [build](doc/cli/build.md)
- [config](doc/cli/config.md)
- [csslint](doc/cli/csslint.md)
- [extension](doc/cli/extension.md)
- [help](doc/cli/help.md)
- [import](doc/cli/import.md)
- [jshint](doc/cli/jshint.md)
- [minify](doc/cli/minify.md)
- [project](doc/cli/project.md)
- [search](doc/cli/search.md)
- [update](doc/cli/update.md)
- [webserver](doc/cli/webserver.md)
