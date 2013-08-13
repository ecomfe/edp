build
---------

### Usage

    edp build [--config=confFile] [--output=outputDir] [--exclude=excludeFiles] [--force]

### Options

+ --config - 指定构建配置文件。
+ --output - 构建结果输出目录。如果输出目录存在，为了防止现有目录中内容被覆盖和混合，构建过程将中断。
+ --exclude - 指定忽略的文件列表，`,`号分隔。
+ --force - 强制构建。如果输出目录存在时，指定此选项，将强制删除现有的输出目录，并重新创建空目录。

### Description

在`当前目录`进行打包构建。

`构建`主要指将`开发环境`的工程和代码进行`编译`和`转换`，使其适合`线上环境`使用。

`构建`过程的运行需要一个`配置文件`，该文件是一个NodeJs模块。查找方式为：从`当前目录`向上查找，发现目录下包含`edp-build-config.js`文件时，将其作为`配置文件`。如果找不到`配置文件`，则以`默认配置文件`启动。

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

#### 配置build

配置模块 *必须* 包含暴露的`injectProcessor`方法。

    exports.injectProcessor = function ( processors ) {
        for ( var key in processors ) {
            global[ key ] = processors[ key ];
        }
    };

配置文件允许暴露的成员如下：

##### input 

构建的输入目录

##### output 

构建的输出目录

##### exclude

忽略的文件或目录列表

##### getProcessors

返回处理器列表的方法

builder会通过`injectProcessor`方法将内建处理器的类注入配置模块。当前`builder`支持的内建处理器有：

+ ModuleCompiler - 对amd模块进行编译。
+ JsCompressor - 对Javascript进行压缩。
+ LessCompiler - 对less文件进行编译，并替换html中对less的引用为css引用。
+ PathMapper - 对文件资源的输出路径进行替换映射处理，并替换html中对相应资源的引用路径。

#### 默认build配置

下面是build的默认配置，供定制配置的同学参考：

    var cwd = process.cwd()
    exports.input = cwd;

    var path = require( 'path' );
    exports.output = path.resolve( cwd, 'output' );

    var moduleEntries = 'html,htm,phtml,tpl,vm,js';
    var pageEntries = 'html,htm,phtml,tpl,vm';


    exports.getProcessors = function () {
        return [ 
            new LessCompiler( {
                entryExtnames: pageEntries
            } ), 
            new ModuleCompiler( {
                configFile: 'module.conf'
            } ), 
            new JsCompressor(), 
            new PathMapper( {
                replacements: [
                    { type: 'html', tag: 'link', attribute: 'href', extnames: pageEntries },
                    { type: 'html', tag: 'img', attribute: 'src', extnames: pageEntries },
                    { type: 'html', tag: 'script', attribute: 'src', extnames: pageEntries },
                    { extnames: moduleEntries, replacer: 'module-config' }
                ],
                from: 'src',
                to: 'asset'
            } ) 
        ];
    };

    exports.injectProcessor = function ( processors ) {
        for ( var key in processors ) {
            global[ key ] = processors[ key ];
        }
    };

