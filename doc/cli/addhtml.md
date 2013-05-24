addhtml
---------

### Usage

    edp addhtml <htmlfile>


### Description

添加一个HTML文件。

添加的HTML文件为`UTF-8`编码，并将自动包含基础的HTML结构。

如果HTML文件位于一个`项目`内部，将自动添加`AMD Loader`的引用，并生成`require.config`配置。配置来源为项目根目录下的`module.conf`文件。



