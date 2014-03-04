import
---------

### Usage

    edp import <name>[@version]
    edp import <localfile>
    edp import <package.json> [--older] [--save-dev]


### Description

导入包。将包导入到本地开发环境，默认为`dep`目录。`dep`目录下的`packages.manifest`文件为`edp`自动管理和更新。

+ 如果`当前目录`处于`项目目录`下，将导入`项目目录`下的`dep`目录，更新`项目目录`下的`module.conf`文件，并自动更新项目中所有HTML的`require.config`配置。
+ 如果`当前目录`不处于`项目目录`下，将导入`当前目录`下的`dep`目录。


默认情况下`import`从`http://registry.edp.baidu.com`导入包。从本地文件导入包时，`localfile`支持`.zip`、`.tar.gz`、`.tgz`文件。

支持从`package.json`文件导入包，同时有两个可选参数：`--older`表示只导入最低版本的包；`--save-dev`表示同时导入`devDependencies`。

