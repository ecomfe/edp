title: 内置资源处理函数
categories:
- WebServer
tags:
-  webserver
-  config
-  function
layout:
    layout
date:
    01-07
---

EDP内置了一些`资源处理函数`，可以满足对常见资源的处理。下面列举一些常用的内置`资源处理函数`。

# file

file接受一个参数 `@param {string} file`，如果指定了文件，会渲染指定文件，否则会根据请求的路径输出文件内容。

1. 如果`pathname`是一个目录，会调用`listDirectory`输出当前目录文件列表
2. 如果`pathname`是一个文件，直接输出文件内容

两种情况都会以config中配置的`documentRoot`作为根目录。

参数：

- `file`: {string} 指定的输出文件

```javascript
{
    location: /^.*$/,
    handler: file()
}
```
# content

直接输出指定固定内容。

参数：

- `content`: {string} 输出内容

```javascript
{
    location: '/hello',
    handler: content('Hello World!')
}
```

# header

设置指定的response header，新设置的头会覆盖`context.header `中已有的项。

参数：

- `header`: {Object} response header

```javascript
{
    location: /^.*$/,
    handler: header({'x-copyright': 'your name'})
}
```

#### contentType

输出固定Content-Type头，会覆盖已有的`content-type`的值。

参数：

- `contentType`: 返回的contentType的值

```javascript
{
    location: /^.*$/,
    handler: contentType('text/plain')
}
```

# json

将数据按JSON格式输出，将自动设置为JSON的Content-Type

参数：

- `data`: 需要返回的data

```javascript
{
    location: '/data',
    handler: json({
        // ...
    })
}
```

# jsonp

将JSON数据按jsonp的方式输出，将自动设置为JS的Content-Type

参数：

- `data`: 需要返回的参数，如果`JSON.stringify`失败，则使用context.content代替
- `callbackKey`: 回调函数名在url中的key值，默认使用callback

```javascript
{
    location: '/data',
    handler: jsonp(
        {
            // ...
        },
        'callbackFunction'
    )
}
```

# dumpRequest

打印请求信息，打印的内容包括：

- `url`: request.url
- `method`: request.method
- `httpVersion`: request.httpVersion
- `protocol`: request.protocol
- `host`: request.host
- `auth`: request.auth
- `hostname`: request.hostname
- `port`: request.port
- `search`: request.search
- `hash`: request.hash
- `headers`: request.headers
- `query`: request.query
- `body`: request.bodyBuffer


```javascript
{
    location: /^.*$/,
    handler: dumpRequest()
}
```

# redirect

重定向，根据permanent决定返回头是302还是301

参数：

- `location`: 重定向地址
- `permanent`: 是否永久，如果是永久，则status code是301，否则是302

```javascript
{
    location: '/',
    handler: redirect('/404')
}
```

# less

对`context.content`进行less编译

参数：

- `compileOptions`: less编译参数
- `encoding`: 源编码方式

```javascript
{
    location: /\.less($|\?)/,
    handler: [
        file(),
        less()
    ]
}
```

# autoless

对css资源的请求，自动查找相应的同名less文件，并编译输出

参数：

- `compileOptions`: less编译参数
- `encoding`: 源编码方式

```javascript
{
    location: /\.css($|\?)/,
    handler: [
        autoless()
    ]
}
```

# stylus

对`context.content`进行stylus编译

参数：
- `compileOptions`: less编译参数
- `encoding`: 源编码方式

```javascript
{
    location: /\.styl($|\?)/,
    handler: [
        file(),
        stylus()
    ]
}
```

# autostylus

对css资源的请求，自动查找相应的同名stylus文件，并编译输出

参数：
- `compileOptions`: less编译参数
- `encoding`: 源编码方式

```javascript
{
    location: /\.css($|\?)/,
    handler: [
        autostylus()
    ]
}
```

# autocss

对css资源的请求，自动查找相应的同名stylus或者less文件，并编译输出，autostylus和autoless都是基于autocss实现

参数：
- `compileOptions`: less编译参数
- `encoding`: 源编码方式

```javascript
{
    location: /\.css($|\?)/,
    handler: [
        autocss()
    ]
}
```

# coffee

对`context.content`进行coffee编译

```javascript
{
    location: /\.coffee($|\?)/,
    handler: [
        file(),
        coffee()
    ]
}
```

# autocoffee

对js资源的请求，自动查找相应的同名coffee文件，并编译输出

参数：
- `encoding`: 源编码方式

```javascript
{
    location: /\.js($|\?)/,
    handler: [
        autocoffee()
    ]
}
```

# php

处理对php文件的请求，当前只处理url后缀是php的请求，根据当前pathname找到php文件，调用php-cgi，输出执行后的内容

参数：

- `opt_handler`: php-cgi可执行文件的路径，默认为path中的php-cgi
- `opt_suffix`: 文件后缀名（当前不可用）
- `opt_forwardPathName`: 函数，将此函数的返回值作为php文件的路径

```javascript
{
    location: /\.php($|\?)/,
    handler: [
        php()
    ]
}
```

# proxy

后端代理当前请求，转发到对应的主机上

参数：

- `hostname`: 主机名，可为域名或者IP
- `port`: 端口，默认80

```javascript
{
    location: /\.js($|\?)/,
    handler: proxy('127.0.0.1', '8081')
}
```

# proxyNoneExists

如果当前`context.status`等于404时，代理转发当前请求

查找config中的proxyMap，如果配置有如下：
```javascript
exports.proxyMap = {
    '127.0.0.1:8080': 'www.baidu.com:80'
};
```
则会把127.0.0.1:8080的请求代理到www.baidu.com:80

```javascript
{
    location: /^.*$/,
    handler: [
        file(),
        proxyNoneExists()
    ]
}
```

# html2js

如下示例中的配置会将`html2js.js`的文件定位到`html2js`文件，并调用html2js转化为js文件输出

参数：

- `compileOptions`: 编译参数
- `encoding`: 源编码方式

```javascript
{
    location: /\.js($|\?)/,
    handler: html2js()
}
```

# livereload

在html代码的body结束标签前增加下面一个script标签
```html
<script src="http://{options.ip}:{options.port}/livereload.js"></script>
```


参数：

- `options`: LiveReload的参数
- `options.ip`: LiveReload服务器的IP地址，默认为当前机器的ip地址
- `options.port`: LiveReload服务器的端口号，默认为8898
- `options.encoding`: 文件编码，默认为utf-8

# listDirectory

输出指定的dir目录或者当前请求的pathname对应的目录下的文件列表

参数：

- `dir`: 指定路径，默认为当前请求的pathname

```javascript
{
    location: /\/$/,
    handler: listDirectory()
}
```

# addRequestHeader

配合Proxy Handler使用，添加一些自定义的*Request Header*

参数：

- `headers`: 自定义请求头

```javascript
{
    location: /\.js($|\?)/,
    handler: [
        addRequestHeader({
            'host': 'www.baidu.com'
        }),
        proxy()
    ]
}
```

# write

输出当前context的内容，并结束请求

注意：write对一般开发者来说不要去使用，edp webserver会默认在handlers的最后面增加一个write handler，如果开发者调用的write，最后面一个write handler执行的时候会报错


# home

主索引页

查找当前pathname路径下的指定索引文件，如果没找到，则使用`listDirectory`来作为输出

参数：

- `file`: {string|Array} 主索引文件，如果是数组，则从0开始寻找可用的主索引文件，找到了一个会忽略其他的文件

```javascript
{
    location: '/',
    handler: home('index.html')
}
```

# delay

延迟输出

参数：

- `time`: 延迟输出的时间，单位为ms

```javascript
{
    location: '/hello',
    handler: [
        content('Hello World!'),
        delay(500)
    ]
}
```

# empty

输出空内容

```javascript
{
    location: '/empty',
    handler: empty()
}
```
