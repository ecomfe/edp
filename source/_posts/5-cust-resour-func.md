title: 自定义资源处理函数
categories:
- WebServer
tags:
-  webserver
-  config
-  function
layout:
    layout
date:
    01-06
---

当内置的资源处理函数无法满足自己需求的时候，也可以很方便的添加一个自定义的资源处理函数。假定我们希望将符合`POST /data/***`特征的请求以mockup数据返回，但是mockup的数据放在`src/mockup`目录下面，那么我们可以添加一个自己的处理函数`mockup`，同时配合`file`来完成这个工作。

```
exports.getLocations = function () {
    return [
    	...
        {
            location: /^\/data\//,
            handler: [
                mockup(),
                file()
            ]
        },
        ...
    ];
}
```

其中`mockup`的实现很简单，就是把`pathname`的内容修改一下，后续交给`file`处理即可。

```
function mockup() {
    return function( context ){
        var pathname = context.request.pathname;
        context.request.pathname = '/src/mockup/' + pathname + '.json';
    }
}
```