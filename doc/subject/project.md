项目管理
-------

edp默认支持项目管理的基础功能。

### 初始化项目

`edp project init`命令将初始化`当前目录`为`项目目录`。通常我们使用如下两条命令创建项目：

    $ mkdir projectdir && cd projectdir
    $ edp project init

该命令将创建项目信息的元数据，以JSON的格式存放于`.edpproj/metadata`文件中。手工修改该文件需要谨慎。

该命令将自动创建标准的项目目录结构。如果`当前目录`已经位于`项目目录`下，初始化行为将失败。详细的目录结构说明请参考[项目目录结构规范](/)。

用户可以通过[自定义扩展](extension.md)，自定义符合自己需求的项目目录结构。



### 为项目导入包

`当前目录`位于`项目目录`下时，可以使用`edp import`命令，为项目导入包。

    $ edp import er

包存放于项目目录中的`lib`目录下。原则上，包的内容不允许项目开发人员修改。导入过程中，edp将：

1. 导入其依赖的相关包
2. 自动更新项目中的加载器配置


### loader配置自动化

在`导入包`、`添加html`等行为时，edp默认将自动添加loader配置，或扫瞄包含loader配置的文件并更新loader配置。自动更新的配置项包括`baseUrl`、`paths`、`packages`。

自动添加/更新loader配置时，edp需要计算相关路径信息。如果文件的路径与其访问路径不同时（常见于模版文件或javascript文件），需要指定`文件元数据`的`webpath`选项。

将`项目信息的元数据`的`loaderAutoConfig`选项修改为`false`可关闭loader的配置自动化功能。如果想让某一个文件的loader配置不自动更新，可以将该文件的`文件元数据`的`loaderAutoConfig`选项设置为`false`。

更多关于`文件元数据`的内容请参考[文件元数据文档](file-metadata.md)




### 打包构建

to be continue...



