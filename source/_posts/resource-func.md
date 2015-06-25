title: 资源处理函数
categories:
- webserver
tags:
-  webserver
-  config
-  function
layout:
    layout
date:
    2015-01-08
---


`EDP WebServer`在请求到来时，将请求和应答封装成一个`context`对象。在资源处理阶段，`EDP WebServer`将这个`context`对象传递给资源处理函数，资源处理函数通过操作这个`context`对象，来达到各种目的：`输出相应的http状态码`、`输出相应的内容`、`输出相应的请求头`等。

所以，资源处理函数应该是类似如下的形式：

```javascript
function error(context) {
    context.status = 500;
}
```

`context`对象包含如下内容：

- `request`： 请求对象，可以从该对象上获得用户请求信息
- `response`： 响应对象，不建议直接操作该对象
- `status`： 状态码
- `content`： 响应体的内容
- `header`： 响应头内容
- `end`： function，调用该函数将终结对请求的响应
- `stop`： 资源处理暂停。如果资源处理为异步时，需要调用该函数，让处理链暂停
- `start`： 资源处理开始。如果资源处理为异步，当处理完成时，需要调用该函数，让处理链启动，继续向下走

通常，在资源处理函数中，我们可能会这样操作`context`对象：

- 添加响应头：`context.header['Content-Type'] = 'text/javascript'`
- 设置响应内容：`context.content = JSON.stringify(jsonData)`
- 设置返回状态码：`context.status = 404`
- 读取请求信息：`context.request.pathname`
