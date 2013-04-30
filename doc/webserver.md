调试服务器
--------

### 启动调试服务器

edp自带了默认的调试服务器，通过下面的命令可以启动调试服务器。

    $ [sudo] edp webserver start
    EDP WebServer start, listen 80

启动调试服务器可能需要`sudo`。

### 调试服务器行为

- 如果`当前目录`处于`项目目录`下，调试服务器启动时将以`项目目录`作为DocumentRoot。
- 如果`当前目录`不处于`项目目录`下，调试服务器启动时将以`当前目录`作为DocumentRoot。

`项目`相关内容请参考[项目管理](project.md)


