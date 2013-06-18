project
---------

### Usage

    edp project init
    
### Description

`init`子命令可以初始化`当前目录`为`项目目录`。

以`项目`为单位管理开发过程，可以获得更多的便利性。

1. 在`项目目录`下任意子目录启动`webserver`时，都将以`项目目录`作为DocumentRoot。
2. 在`项目目录`下任意子目录使用`import`、`update`时，导入的包都将直接导入项目的`dep`目录。
3. 拥有默认的项目`build`逻辑，`build`更方便。
4. 自动管理`loader config`。在`import`、`update`或者`addhtml`时，`loader config`都将自动配置。
5. etc.

详细内容请参考`webserver`、`import`、`update`、`build`、`addhtml`文档。


