import
---------

### Usage

    edp import <name>[@version]


### Description

导入包。将包从`仓库`导入到本地开发环境，默认为`dep`目录。`dep`目录下的`packages.manifest`文件为`import`管理，自动更新。

+ 如果`当前目录`处于`项目目录`下，将导入`项目目录`下的`dep`目录，更新`项目目录`下的`module.conf`文件，并自动更新项目中所有HTML的`require.config`配置。
+ 如果`当前目录`不处于`项目目录`下，将导入`当前目录`下的`dep`目录。

