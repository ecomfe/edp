title: Command Resolve
categories:
- command-extension
tags:
-  command
-  command resolve
layout:
    layout
date:
    2015-01-04
---


当我们执行`edp <cmd> [<sub-cmd>] --arg1=foo --arg2=bar`的时候，首先面临的一个问题是需要根据`<cmd>`定位到提供哪个npm package提供了`<cmd>`的实现。定位的过程如下：

1. 检查edp的package.json中`edp.extensions`的每一项，对应的value数组里面是否包含`<cmd>`
2. 如果存在，去第3步，否则去第4步
3. 把该项的key当做npm package的名称，返回
4. 检查edp的package.json中`edp.extendsions`是否存在`edp+<cmd>`的配置，如果存在，把`edp+<cmd>`当做npm package的名称，返回
5. 最后都没有找到，那么把`edpx+<cmd>`当做npm package的名称，返回

找到npm package之后，就会自动安装（如果之前没有安装过），然后根据这个`<cmd>`去npm package下面的`cli`目录找到对应的js文件，require之后返回一个`cli`对象，执行`cli.main`即可

# Default Command

当我们执行`edp project`的时候，因为根据前面的Command Resolve逻辑，没有任何一个npm package提供了`project`这个命令，但是在`edp.extensions`里面配置了edp-project，因此我们找到并安装了edp-project之后，需要执行edp-project的Default Command。

Default Command的名称跟npm package的名称一样（去掉edpx和edp的前缀之后）。对于edp-project来说，它的Default Command就是project，所处的位置也是在npm package的cli目录下面。

# Sub Command

edp是支持<sub-cmd>的，当执行`edp project init`的时候，`init`就是`project`的`<sub-cmd>`，这个从目录结构层级上可以区分出来：

```
$ edp-project git:(1.0.0-dev) tree cli
cli
├── project
│   ├── init.js
│   ├── initBuild.js
│   ├── initWebServer.js
│   └── updateLoaderConfig.js
└── project.js
```

# Arguments and Options

cmd执行的时候有时候需要传递一些额外的参数。参数有两种形式：Arguments和Options。

如果要设置cmd所支持的Options，可以采用如下的方式：

```javascript
exports.cli = {
    options: [ 'foo', 'bar:' ]
};
```

`bar:`后面的**冒号**意思是这个参数需要提供参数值。

那么当执行`edp <cmd> a b c --foo --bar=hello`的时候，Options参数的值如下：

```javascript
{
    foo: true, f: true,
    bar: 'hello', b: 'hello'
}
```

Arguments参数的值如下：`[ 'a', 'b', 'c' ]`

如果`a`是`<cmd>`的`<sub-cmd>`，那么最终执行的是`<sub-cmd>`，传递给`<sub-cmd>`的Arguments参数值是：`[ 'b', 'c' ]`，依此类推。