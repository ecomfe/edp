title: 配置WebServer
categories:
- webserver
tags:
-  webserver
-  config
layout:
    layout
date:
    2015-01-09
---

运行`edp webserver start`时，默认使用的`配置文件`为当前目录下的`edp-webserver-config.js`。如果该文件不存在，将使用`默认配置`。你可以新建一个`edp-webserver-config.js`，或者使用其他文件名，在运行命令时通过`--config`参数指定。

配置文件是一个`node module`，EDP在`WebServer`启动前将`require`它，所以，配置文件后缀必须为`.js`。

下面是EDP的构建默认配置。通过edp提供的[项目管理功能](/Doc/Project-management/1-initProj/)来初始化`项目`时，生成的`edp-webserver-config.js`与此可能不同。

```javascript
exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;
exports.getLocations = function () {
    return [
        {
            location: /\/$/,
            handler: home( 'index.html' )
        },
        {
            location: /^\/redirect-local/,
            handler: redirect('redirect-target', false)
        },
        {
            location: /^\/redirect-remote/,
            handler: redirect('http://www.baidu.com', false)
        },
        {
            location: /^\/redirect-target/,
            handler: content('redirectd!')
        },
        {
            location: '/empty',
            handler: empty()
        },
        {
            location: /\.css($|\?)/,
            handler: [
                autoless()
            ]
        },
        {
            location: /\.less($|\?)/,
            handler: [
                file(),
                less()
            ]
        },
        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
```

我们建议：通过edp提供的[项目管理功能](/Doc/Project-management/1-initProj/)来初始化`项目`，在其生成的`edp-webserver-config.js`上进行`WebServer`配置自定义。

在自定义自己的`WebServer`配置时，有下面几个东西需要了解和注意：

# port

监听端口号。为了防止和其他常用的`WebServer`冲突，默认为8848，不为80或8080。
# directoryIndexes

是否允许显示目录下的文件索引。

# documentRoot

`WebServer`使用的文档根目录。默认为`配置文件`所在的当前目录。

# injectResource

该方法用于EDP将内置的`资源处理函数`注入到配置模块中，从而在配置模块里可以使用内置`资源处理函数`。请保持该方法的存在，并使用默认实现，不要修改它。

# getLocations

该方法返回一个数组，数组的每一项是一个具有`location`和`handler`的`Object`，代表能被`location`匹配上的资源，使用`handler`进行处理。

`location`可以是一个`string`，也可以是一个`RegExp`。

`handler`可以是一个资源处理函数`function({Object}context)`，也可以是一个包含多个资源处理函数的数组`Array.function({Object}context)`。你可以使用`EDP WebServer`自带的资源处理函数，也可以自己编写一个Javascript Function做为资源处理函数。

详细了解`资源处理函数`，请阅读接下来的两个章节。