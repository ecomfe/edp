调试服务器
--------

### 启动调试服务器

edp自带了默认的调试服务器，通过下面的命令可以启动调试服务器。

    $ [sudo] edp webserver start
    EDP WebServer start, listen 80

启动调试服务器可能需要`sudo`。

支持`--proxy`和`--port`参数，还可以直接指定web服务器启动目录：

    edp webserver start [--port=PORT] [--proxy=PROXY_CONFIG_FILE] [DOCROOT]

通过`--port`指定的端口将覆盖服务器配置文件上的端口配置。

通过`--proxy`可以指定一个包含代理服务器配置的文件，格式如下：

    {
        "local.com:8080": "backend.com:8000",
        "another.local.com": "another.backend.com:8112"
    }

同时还可以手动指定DOCROOT，方便处于非项目目录的时候指定网站根目录。

### 服务器配置文件

服务器配置文件路径`.edpproj/webserver-conf.js`。

可以指定默认的端口，默认网站根目录，less文件包含路径，以及各种handler。

### 调试服务器行为

- 如果指定了DOCROOT，调试服务器启动时将以此目录作为DocumentRoot。
- 如果没有指定DOCROOT，且`当前目录`处于`项目目录`下，调试服务器启动时将以`项目目录`作为DocumentRoot。
- 如果没有指定DOCROOT，且`当前目录`不处于`项目目录`下，调试服务器启动时将以`当前目录`作为DocumentRoot。

`项目`相关内容请参考[项目管理](project.md)


