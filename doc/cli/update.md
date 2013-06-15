update
---------

### Usage

    edp update
    edp update [name]

### Description

更新包。自动从`registry`检查依赖，发现有新版本时更新。从文件import的包如果在`registry`不存在，将无法自动更新。

指定`name`时，将只更新指定的依赖包，不更新所有依赖包。

+ 如果`当前目录`处于`项目目录`下，将从`项目目录`的`package.json`或`.edpproj/metadata`文件中读取依赖包声明。
+ 如果`当前目录`不处于`项目目录`下，将从`当前目录`下的`package.json`文件中读取依赖包声明。


