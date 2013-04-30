包管理
------

edp提供了包管理功能，用于不同项目之间相同功能代码模块的复用。包必须遵循[包规范](#)


包仓库使用的是`npm registry`，默认为`http://registry.edp.baidu.com`。


### 包查询

`search`命令可以查询`仓库`中的包。

    edp search <keyword>

### 包导入

`import`命令可以从`仓库`中将包导入到本地开发环境。

    edp import <name>[@version]

- 如果`当前目录`处于`项目目录`下，将导入`项目目录`下的`lib`目录，并自动更新loader配置。
- 如果`当前目录`不处于`项目目录`下，将导入`当前目录`下的`lib`目录。

`项目`相关内容请参考[项目管理](project.md)
