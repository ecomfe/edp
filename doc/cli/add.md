add
---------

### Usage

    edp add js <jsfile> [--id=yourid] [--type=function|object] [--force]
    edp add html <htmlfile> [--force]

### Options

+ --type - 指明模块`exports`对象的类型，`object | function`，默认为`object`。
+ --force - 强制覆盖已经存在的文件

### Description

添加一个Javascript文件。

添加的Javascript文件是符合[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)的匿名模块声明。

添加一个HTML文件。

添加的HTML文件为`UTF-8`编码，并将自动包含基础的HTML结构。

如果HTML文件位于一个`项目`内部，将自动添加`AMD Loader`的引用，并生成`require.config`配置。配置来源为项目根目录下的`module.conf`文件。
