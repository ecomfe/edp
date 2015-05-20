title: 通过配置进行自定义构建
categories:
- Build
tags:
-  build
-  customize
layout:
    layout
date:
    01-15
---


运行`edp build`时，默认使用的`配置文件`为当前目录下的`edp-build-config.js`。如果该文件不存在，将使用[默认配置](https://github.com/ecomfe/edp-build/blob/1.0.0-dev/lib/config.js)。你可以新建一个`edp-build-config.js`，或者使用其他文件名，在运行命令时通过`--config`参数指定。

配置文件是一个`node module`，EDP在构建时将`require`它，所以，配置文件后缀必须为`.js`。

下面是EDP的构建默认配置。通过edp提供的[项目管理功能](/Doc/Project-management/1-initProj/)来初始化`项目`时，生成的`edp-build-config.js`与此不同。

```javascript
var cwd = process.cwd();
var path = require( 'path' );

exports.input = cwd;
exports.output = path.resolve( cwd, 'output' );

exports.exclude = [
    'tool',
    'doc',
    'test',
    'module.conf',
    'dep/packages.manifest',
    'dep/*/*/test',
    'dep/*/*/doc',
    'dep/*/*/demo',
    'dep/*/*/tool',
    'dep/*/*/*.md',
    'dep/*/*/package.json',
    'edp-*',
    '.edpproj',
    '.svn',
    '.git',
    '.gitignore',
    '.idea',
    '.project',
    'Desktop.ini',
    'Thumbs.db',
    '.DS_Store',
    '*.tmp',
    '*.bak',
    '*.swp',
    'node_module'
];

exports.getProcessors = function () {
    return [
        new LessCompiler(),
        new PathMapper()
    ];
};

exports.injectProcessor = function ( processors ) {
    for ( var key in processors ) {
        global[ key ] = processors[ key ];
    }
};
```

我们建议：通过edp提供的[项目管理功能](/Doc/Project-management/1-initProj/)来初始化`项目`，在其生成的`edp-build-config.js`上进行构建配置自定义。


在自定义自己的构建配置时，有下面几个东西需要了解和注意：

# input

输入目录，`{string}`，默认为`当前目录`。该属性基本不需要修改。

# output

输出目录，`{string}`，默认为`当前目录下的output目录`。

# exclude

排除文件，`{Array}`。该数组里匹配上的每一项，在构建的`输入`阶段就会被排除，所以，被排除的文件也不会进入后续的`处理`和`输出`阶段。

数组中的每一项可以是符合[minimatch](https://www.npmjs.org/package/minimatch)规则的pattern，也可以是正则表达式。例如我只想排除到项目根目录下面的tool目录，而不是所有的tool目录，就可以这么写：

```javascript
exports.exclude = [
    /^tool\//,
    'Thumbs.db',
    '.DS_Store',
    '*.tmp',
    '*.bak',
    '*.swp'
];
```

# fileEncodings

在处理输入文件的过程中，`edp`默认所有的**文本文件**都是`utf-8`编码的，如果有一些特殊编码的文件，需要在这个参数中声明，这样子才能保证输出的时候文件编码保持不变。

```
exports.fileEncodings = {
    'src/common/img/channel-example-csv.csv': 'gbk'
}
```

# getProcessors

处理器列表，`{Array} function`。该方法会被EDP在构建时调用，获取构建过程的Processors。

EDP提供了许多内置Processors，基本可以满足前端项目的构建需求。你可以使用内置Processors，也可以扩展自己的Processor。我们在[Build Processors文档](/Doc/Build/2-buildProc/)对此进行了详细说明。

# injectProcessor

该方法用于EDP将内置的Processors注入到配置模块中，从而在配置模块里可以使用内置Processors。请保持该方法的存在，并使用默认实现，不要修改它。