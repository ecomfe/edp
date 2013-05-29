build
---------

### Usage

    edp build [--output=outputDir] [--processors-conf=confFile] [--exclude=excludeFiles]

### Options

+ --output - 构建结果输出目录。如果输出目录存在，为了防止现有目录中内容被覆盖和混合，构建过程将中断。
+ --processors-conf - 指定处理器配置文件。详细信息见下方`processors`章节。
+ --exclude - 指定忽略的文件列表，`,`号分隔。

### Description

在`当前目录`进行打包构建。

`构建`主要指将`开发环境`的工程和代码进行`编译`和`转换`，使其适合`线上环境`使用。

#### 打包构建过程

1. 初始化：builder创建一个构建运行时`ProcessContext`对象。
2. 输入：builder遍历读取目标目录下的文件，为每个文件创建一个`FileInfo`对象，并添加到`ProcessContext`中。`exclude`参数指定的文件将被忽略。
3. 处理：builder使用`processors`对每个`ProcessContext`中的`FileInfo`进行处理。
4. 输出：builder读取`ProcessContext`中的所有`FileInfo`，进行输出。

#### FileInfo

`FileInfo`对象在`输入过程`由builder自动创建，其包括如下属性：

+ data - 文件数据内容。二进制文件的data为`Buffer`对象；文本文件的data为string，builder将自动以`UTF-8`进行解码。
+ extname - 文件扩展名。
+ path - 文件相对于`构建目录`的相对路径。
+ fullPath - 文件的绝对路径。
+ outputPath - 相对于`输出目录`的相对路径，输出阶段由builder使用。默认与`path`值相同。

#### processors

`处理过程`中使用的`processors`可以通过`processors-conf`参数指定一个`processors`配置文件。配置文件内容为`JSON`格式的数组，其中每项是代表一个`proccessor`信息的Object。当前`builder`支持的`proccessor`有：

+ module-compiler - 对amd模块进行编译。
+ js-compressor - 对Javascript进行压缩。
+ less-compiler - 对less文件进行编译，并替换html中对less的引用为css引用。
+ path-mapper - 对文件资源的输出路径进行替换映射处理，并替换html中对相应资源的引用路径。

不指定`processors-conf`时，`builder`将自动选择`处理过程`使用的`processors`：

+ 如果`构建目录`为`项目目录`，使用项目的元数据信息项`buildProcessors`作为`processors`配置。
+ 如果`构建目录`为普通目录，使用默认`processors`配置。

##### 默认配置信息

    [
        { 
            name: 'module-compiler',
            configFile: 'module.conf',
            entryExtnames: 'html,htm,phtml,tpl,vm,js'
        },
        { name: 'js-compressor' },
        { 
            name: 'less-compiler',
            entryExtnames: 'html,htm,phtml,tpl,vm' 
        },
        {
            name: 'path-mapper',
            replacements: [
                { type: 'html', tag: 'link', attribute: 'href', extnames: 'html,htm,phtml,tpl,vm' },
                { type: 'html', tag: 'img', attribute: 'src', extnames: 'html,htm,phtml,tpl,vm' },
                { type: 'html', tag: 'script', attribute: 'src', extnames: 'html,htm,phtml,tpl,vm' },
                { extnames: 'html,htm,phtml,tpl,vm,js', replacer: 'module-config' }
            ],
            from: 'src',
            to: 'asset'
        }
    ]

