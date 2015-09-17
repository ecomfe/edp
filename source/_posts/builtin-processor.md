title: 内置 Processor
categories:
- build
tags:
-  build
layout:
    layout
date:
    2015-01-17
---

EDP很重要的一个功能就是通过`edp build`来构建项目。在[构建过程](Build#%E6%9E%84%E5%BB%BA%E8%BF%87%E7%A8%8B)中，`处理`阶段，对资源的处理主要由一个或多个Processor完成。Processor直接是链式的串行处理过程，每个Processor处理的是上一个Processor处理后的结果。

## 公共属性

### files属性

该属性从 **1.0.0版本** 开始引入。

通过`Processor`的`files`参数可以为`Processor`选择需要处理的文件。每个`Processor`都支持`files`，其是一个`Array`，其中每一项是一个符合glob规则的`pattern string`。后续的各个`Processor`介绍将不再对`files`参数进行说明。

每个`Processor`在开始处理前，其要处理的文件是一个`空集`，我们称作`PROCESS_FILES`。通过`files`的每一项`pattern` **按顺序** 选择文件。

- 如果`pattern`不以`!`开头，从`BUILD_FILES`中选出符合该`pattern`的文件放入`PROCESS_FILES`
- 如果`pattern`以`!`开头，从`PROCESS_FILES`中将符合该`pattern`的文件排除

```javascript
new LessCompiler({
    files: [
        '*.less',
        '!test/**/*.less'
    ]
})
```

## LessCompiler

编译`less`文件，并对其他文件中`less`资源的引用替换成`css`。具体有：

1. \*.less编译为\*.css
2. entryFiles指定入口文件，把`<link href="*.less">`替换为`<link href="*.css">`
3. \*.js中通过插件引用\*.less的地方修改为\*.css

```
new LessCompiler({
    files: [ '*.less' ],
    /* entryExtnames: 'html,php,tpl' 旧版本使用 新版本种兼容但不推荐 推荐使用entryFiles*/
    entryFiles: [
        '*.html', '*.htm', '*.phtml',
        '*.tpl', '*.vm', '*.js'
    ]
});
```


下面是`LessCompiler`的参数说明：

### compileOptions

`Object`。less编译参数，默认值为：

```
{
    paths: [ less file's directory ],
    relativeUrls: true
}
```

如果想要输出的css是压缩之后的，可以添加参数`{ compress: true }`即可，一定程度上可以代替`CssCompressor`的功能.

### entryFiles

`Array.<string>`，less入口文件选择，规则与`files`相同。 **默认值** 是：

```javascript
[ 
    '*.html', 
    '*.htm', 
    '*.phtml',
    '*.tpl',
    '*.vm',
    '*.js' 
]
```

被匹配上的文件被称为less入口文件。`LessCompiler`将自动扫描里面对`less`资源的引用，替换成`css`。

### files

`Array.<string>`，**默认值**是`[ '*.less' ]`


### less

`Object`，自定义的`less`模块。

`edp-build`有自己依赖的`less`版本，如果不想使用该版本，可以自己提供一个`less`模块：

```
new LessCompiler({
  less: require( "./tools/less" )
})
```

## StylusCompiler

StylusCompiler的功能跟LessCompiler类似。编译`styl`文件，并对其他文件中`styl`资源的引用替换成`css`。

1. \*.styl编译为\*.css
2. entryFiles指定入口文件，把`<link href="*.styl">`替换为`<link href="*.css">`
3. \*.js中通过插件引用\*.styl的地方修改为\*.css


```
new StylusCompiler({
    files: [ '*.styl' ],
     /* entryExtnames: 'html,php,tpl' 旧版本使用 新版本种兼容但不推荐 推荐使用entryFiles */
    entryFiles: [
        '*.html', '*.htm', '*.phtml',
        '*.tpl', '*.vm', '*.js'
    ]

});
```

下面是`StylusCompiler`的参数说明：

### compileOptions

`Object`，stylus编译参数，默认值为：

```
{
    paths: [ stylus file's directory ],
    pathname: 'stylus file's fullpath',
    use: this.compileOptions
}
```

如果想要输出的css是压缩之后的，可以添加参数`{ compress: true }`即可，一定程度上可以代替`CssCompressor`的功能.


### entryFiles

请参考`LessCompiler`的`entryFiles`参数说明。


### files

请参考`LessCompiler`的`files`参数说明。

### stylus

`Object`，自定义的`stylus`模块。

`edp-build`有自己依赖的`stylus`版本，如果不想使用该版本，可以自己提供一个`stylus`模块。使用方式参考`LessCompiler`。


## CssCompressor

对`css`资源进行压缩。`edp-build`使用的css压缩工具是`clean-css`。

```
new CssCompressor({
    files: [ '*.css', '*.less' ]
});
```

下面是`CssCompressor`的参数说明：

### compressOptions

`Object`，`clean-css`的压缩参数，默认值为：

```
{
    "noAdvanced": true,  // clean-css的优化模式某些情况下存在问题，默认禁用
    "keepBreaks": true,  // 不压缩成一行
    "relativeTo": css file's directory
}
```

如果想了解`clean-css`还支持哪些参数，可以查看[clean-css的参数说明](https://github.com/GoalSmashers/clean-css#how-to-use-clean-css-programmatically)。

### files

`Array.<string>`，**默认值**是`[ '*.css' ]`。

## JsCompressor

对`js`资源进行压缩。`edp-build`使用的js压缩工具是`uglifyjs2`。默认只处理`*.js`文件。

```
new JsCompressor({
    files: [ '*.js', '*.coffee' ]
});
```

下面是`JsCompressor`的参数说明：

### files

`Array.<string>`，**默认值**是`[ '*.js', '!*.min.js' ]`。

### compressOptions

`Object`，压缩选项，默认值是：`{ "warnings": false, "conditionals": false }`。详细信息请参考[uglifyjs2 compress options](http://lisperator.net/uglifyjs/compress)

### mangleOptions

`Object`，默认值是：`{ "except": [ 'require', 'exports', 'module' ] }`，也就是给变量重命名的时候，忽略这三个变量名。


### sourceMapOptions

`Object`，生成 [JavaScript Source Map](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) 文件，默认值是: `{ enable: false, root: 'sourcemap', host: null }` `enable`: 表示功能是否开启, `root`: 决定了 output 目录中的source map所在的目录, `host`: 决定了 sourceMappingURL 的前缀

## ModuleCompiler

编译AMD模块。主要是将匿名模块具名化，并根据配置和依赖进行模块合并。默认只处理`*.js`。

`ModuleCompiler`的处理需要一个模块配置文件，该模块配置文件必须是一个JSON文件，详情请参见`configFile`配置项说明。

注意：如果最终发布的代码不需要对代码进行合并，那么就没有必要将匿名模块具名化，因此也无需使用`ModuleCompiler`。

```
new ModuleCompiler({
    configFile: 'my-module.conf'
});
```

下面是`ModuleCompiler`的参数说明：

### files

`Array.<string>`，**默认值**是`[ '*.js' ]`。

### configFile

模块配置文件，默认为`module.conf`。配置文件是一个`JSON`文件，允许包含以下属性：

- `{string}``baseUrl` - 模块查找的根路径，相对于配置文件所在目录。
- `{Object}``paths` - 特殊模块查找路径，相对于`baseUrl`
- `{Array.<Object>}``packages` - 包引入配置，其中每个包配置`location`项的路径相对于`baseUrl`
- `{Object}``combine` - 需要合并的模块，其中key为模块id，value为`{boolean}`或`Object`。

`baseUrl`、`paths`、`packages`配置项为AMD标准配置项，详细说明请参考[AMD Common Config](https://github.com/amdjs/amdjs-api/blob/master/CommonConfig.md)或[ESL的配置文档](https://github.com/ecomfe/esl/blob/master/doc/config.md)

### getCombineConfig

`function(Object=):Object`，接收一个`Object`，返回值是`Object`类型。ModuleCompiler在读取**合并模块配置项**的时候，主要参考两个地方：

1. `module.conf`文件中的`combine`字段
2. `getCombineConfig`函数的返回值

当我们发现配置了`getCombineConfig`之后，就会调用这个函数，传递的参数是`module.conf`中`combine`字段的值。

---

### 常见模块合并场景的配置方法

当我们想要合并一些文件的时候，是以Module Id的维度来声明的。例如，当我们想要合并`src/common/main.js`中的代码，那么可以简单的在`module.conf`中配置：

```
{
    "combine": {
        "common/main": true
    }
}
```
合并的过程是递归处理的，也就是先找到`common/main`的一级依赖，把这些依赖的代码合并进来，然后再找二级依赖，三级依赖等等，最终把`common/main`所有的依赖都合并进来。

```
....
....

define( "common/main", function( require ) {
    ...
    ...
})
```

---

当我们在合并的过程中想要排除一些模块的时候，可以使用`modules`，例如：

```
{
    "combine": {
        "common/main": {
            "modules": [ "!~er" ]
        }
    }
}
```
也就是虽然`common/main`最终可能依赖了`er`的代码，但是不要合并进来，而是需要的时候再去按需加载。

---

当我们在合并的过程中想要显式的加入一些模块的时候，可以使用`modules`，例如：

```
{
    "combine": {
        "common/main": {
            "modules": [ "~esui" ]
        }
    }
}
```
也就是虽然`common/main`没有直接依赖`esui`的代码，但是在将来的某个时刻可能会用到，那么就先合并进来，这样子后续使用的时候就不需要重新去加载了。

## PathMapper

对最终输出的文件路径进行一些改动。主要是基于如下两个方面的考虑：

1. 项目中源码主要放在`src`目录，如果我们最终输出的代码里面还是保留`src`目录，就看起来很不正式
2. 对最终输出的路径进行一些改动，可以一定程度上降低因为浏览器或者CDN缓存导致没有获取最新资源的问题

PathMapper一般做为最后一个Processor。

下面是`PathMapper`的参数说明：


### from

`string`，**默认值**是`src`，用来设置替换的源路径，一般都是配置成：`{ "from": "src" }`。

### to

`string`，**默认值**是`asset`，用来设置替换的目标路径，一般都是配置成：`{ "to": "asset" }`。

有时候，我们希望多版本并存，以前的版本能够被保留，可以配置成：

```
// SvnRevision函数请自己实现
{ 
    "to": "asset-" + SvnRevision()
}
```

### mapper

`function(string):string`，路径映射函数。可以理解为是加强版的from和to，如果单纯的配置`from`和`to`无法满足需求的话，可以配置mapper。

```javascript
new PathMapper({
    mapper: function( value ) { 
        return value.replace( from, to ) 
    }
});
```

### replacements

`Array.<Object>`，用于指定路径替换后相应资源的引用替换，比如将`html`中的`img`标签里`src`属性为`src/img`的替换成`asset/img`。replacements的默认值如下：

```
replacements: [
    { type: 'html', tag: 'link', attribute: 'href', extnames: pageEntries },
    { type: 'html', tag: 'img', attribute: 'src', extnames: pageEntries },
    { type: 'html', tag: 'script', attribute: 'src', extnames: pageEntries },
    { extnames: 'html', replacer: 'module-config' },
    { extnames: 'less,css', replacer: 'css' }
]
```

前面三条规则应该可以猜出是什么意思，这里就不解释了；第四条规则指的是替换*.html中`require.config`的配置，比如把：`{ "baseUrl": "src" }`替换为`{ "baseUrl": "asset" }`；第五条规则是替换所有css文件中引用图片的路径。

替换的时候只是替换相对路径的引用，如果路径是远程的资源，比如`http://`, `https://`, `//`就不会处理，也不应该处理。

## TplMerge

这个Processor的作用是合并项目中出现过的模板资源，这样子在发布状态下就会尽可能的减少模板的请求。

下面是`TplMerge`的参数说明：

### files

`Array.<string>`，**默认值**是`[ 'src/**/*.js' ]`。

### pluginIds

`Array.<string>`，**默认值**是`[ 'tpl', 'er/tpl' ]`，数组中的每一项都是一个模板插件的Id，如果你的项目中模板插件的Id没有被包含在里面，那么就需要配置这个参数。

### configFile

`string`，**默认值**是`module.conf`。详细请参考`ModuleCompiler`的`configFile`。

### outputType

`string`，如果想要把合并之后的模板输出为一个AMD的模块，那么请把这个参数的值设置为`js`，设置其它的值是不接受的。

### outputPluginId

`string`。

如果合并之后，如果想要把合并之后的模板输出为一个AMD的模块，那么请把这个参数值设置为一个模板插件的Id，例如`jstpl`。因为使用`xhr`的方式加载模板的插件跟使用`require`的方式来加载模板的插件应该是不一样的，所以需要单独设置一下这个参数的值。

注意：`outputPluginId`必须同时设置才会有效，否则没有效果。

如果我们把最终合并的模板输出为一个AMD的模块，那么就可以把模板也部署到Cookieless Domain下面了，不再受限于xhr的跨域问题的限制。

注意：如果需要输出为AMD的模块，那么主要的工作是由`html2js`这个npm package来完成的，因此TplMerge在一定程度上完成了Html2JsCompiler的工作。


## AddCopyright

给最终输出的文件头部添加一个版权声明。

默认给`css`、`less`、`js`文件添加版权声明。即`files`的默认值为`['*.css', '*.less', '*.js']`。

如果在`构建配置文件`（通常为`edp-build-config.js`）同级目录下存在`copyright.txt`文件，则版权声明以该文件内容为准。否则将使用默认的版权声明信息：

```
'/*! ' + new Date().getFullYear() + ' Baidu Inc. All Rights Reserved */\n'
```

## VariableSubstitution

将文本文件里`{edp-variable:{variableName}}`相应部分替换成相应`variableName`的值。通常用于为页面的资源引用附加版本号。

```javascript
new VariableSubstitution({
    files: ['*.html'],
    variables: {
        version: '1.0.0'
    }
});

/* 
html里：
<link rel="stylesheet" href="main.css?{edp-variable:{version}}">
会被替换成：
<link rel="stylesheet" href="main.css?1.0.0">
*/
```


下面是`VariableSubstitution`的参数说明：

### variables

`Object`，用于声明各个变量的值。


## MD5Renamer

将静态文件根据`MD5`摘要命名，并且替换html和css中对该资源的引用地址。

以`MD5`命名通常有利于浏览器缓存，甚至可以在HTTP头声明该资源永久缓存。`MD5Renamer`将生成一个内容完全相同，名称为`MD5`摘要的文件。原文件将保留，不做删除。

`MD5Renamer`通常放在Processor链的倒数第二的位置，`PathMapper`前。

```javascript
new MD5Renamer( {
    files: [ 
        "src/common/css/main.less"
    ],
    replacements: {
        html: [
            "index.html"
        ]
    }
} )
```

下面是`MD5Renamer`的参数说明：

### replacements

`Object`，要替换的资源配置。该对象只支持`html`和`css`两个属性，分别是`Array.<string>`。

不同类型的资源，将进行不同的替换：

- 对于`html`，替换script的src、img的src、link的href
- 对于`css`，只替换url()

对非`files`中匹配的资源的引用，将不做替换。上面的例子中，只有对main.less的引用会被替换，ui.less的引用不会被替换。

## OutputCleaner

如果观察最终输出的`output`目录中的文件，你可能会发现可能存在一些完全用不到的文件，例如`*.less`，`*.styl`，如果你想进一步优化的输出的内容，可以使用这个Processor来删除一些明确不需要的文件。

下面是`OutputCleaner`的参数说明：

### files

`Array.<string>`，**默认值**是：`[ '*.less', '*.styl', '*.ts', '*.coffee' ]`


## BabelProcessor

此处理器的作用是使用转译器 *[babel](https://babeljs.io)* 将项目使用ES6语法的js代码转为ES5代码。

下面是`BabelProcessor`的参数说明：

### files

`Array.<string>`，**默认值**是：`[ '*.es6', '*.es' ]`

### compileOptions

`Object, babel` 的参数，默认值是：

```
{
    loose: 'all',
    modules: 'amd',
    compact: false,
    ast: false,
    blacklist: ['strict']
}
```

详细信息请参考[Options for babel transpiling.](https://babeljs.io/docs/usage/options/#options)

## BcsUploader

可以使用这个处理器将文件上传到 bcs(百度云存储) 中

```
new BcsUploader({
    ak: 'ak',
    sk: 'sk',
    bucket: 'weigou-baidu-com',
    prefix: 'bcj-static/20140624',
    concurrent: 5,
    files: [
    ]
})
```

下面是`BcsUploader`的参数说明：

### files

`Array.<string>` 处理器要处理的文件 **默认值**是：`['*.js', '*.css', '*.less']`

### ak

`string` AccessKey bcs提供的

### sk

`string` SecretKey bcs提供的

### bucket

`string` bcs提供的bucket

### prefix

`string` 上传文件的路径的前缀

### concurrent

`number` 上传并发数，**默认值**是：5

### maxSize

`number` 文件最大尺寸 **默认值**是：10 * 1024 * 1024

## CssSpriter

通过[css-spriter](https://github.com/quyatong/CssSpriter)工具分析css文件中引用的图片文件构建成雪碧图，然后自动修改css文件中的图片引用信息

```
new CssSpriter({
    files: [
    ]
})
```

下面是`CssSpriter`的参数说明：

### files

`Array.<string>` 处理器要处理的文件 **默认值**是：`[]`


## htmlMinifier

此处理器默认通过使用[html-minifier](https://github.com/kangax/html-minifier)工具分析html文档的内容，对html文档进行压缩，有效的减小项目内html文档的体积

```
new htmlMinifier({
    files: [],
    minifyOptions: {}
})
```
下面是`htmlMinifier`的参数说明:

### files

`Array.<string>` 处理器要处理的文件 **默认值**是：`['*.html', '*.tpl.html']`

### minifyOptions

`Object, html-minifier` 的参数，默认值是：

```
{
    ignoreCustomComments: [
        /^\s*(\/)?([a-z]+)\s*(?::([\s\S]*))?$/
    ]
}
```
 更多配置参数请参考：[html-minifier](https://github.com/kangax/html-minifier)

## html2js-compiler

将html文档转换成js文档，在js中引用时可以解决跨域的问题

下面是`htmlMinifier`的参数说明:

### files

`Array.<string>` 处理器要处理的文件 **默认值**是：`null`

### extnames

使用文件后缀名配置要处理的文件，与参数`files`功能相同，**默认值**是：`['hjs', 'mustcahe']` 

**需要注意的是**：如果没有配置`files`和`extnames`处理器会自动使用`extnames`的默认值作为要处理的文件，当配置了`files`时处理器会忽略`extnames`的配置

### clean

`boolean` **默认值**是：`false` 配置为true将只发出一条警告，[html2js](https://github.com/junmer/html2js)不去处理文件

### wrap

`string` 表示转换后js代码的包装器类型 **默认值**是：`amd` 

可选值：`null，amd，commonjs` 分别表示无包装，amd包装，CommonJS包装

各参数具体效果请参考:[html2js](https://github.com/junmer/html2js)

### mode

`string` 表示html转换成js代码后的代码样式 **默认值**是：`null` 

可选值：

`null 或者 default`:表示保持原html文档的格式

`compress`:清除原文档中每行开始和结束位置两端的空白以及转义字符

`format`:整理成符合[规范](https://github.com/ecomfe/spec/blob/master/javascript-style-guide.md#建议-使用-数组-或--拼接字符串)的js代码

各参数具体效果请参考:[html2js](https://github.com/junmer/html2js)

## replaceDebug

修正DEBUG变量，将window.DEBUG的值改为false

下面是`replaceDebug`的参数说明:

### files

`Array.<string>` 处理器要处理的文件 **默认值**是：`null`

### extnames

使用文件后缀名配置要处理的文件，与参数`files`功能相同，**默认值**是：`['html']` 

**需要注意的是**：如果没有配置`files`和`extnames`处理器会自动使用`extnames`的默认值作为要处理的文件，当配置了`files`时处理器会忽略`extnames`的配置

## stringReplace

此处理器用于字符串替换

下面是`stringReplace`的参数说明:

### files

`Array.<string>` 处理器要处理的文件 **默认值**是：`null`

### replacements

`Array.<Object>`，用于指定要匹配的字符信息，以及要被替换成的字符串或者返回字符串的函数如下示例：

```
[
    {
        from: 'foo',
        to: 'bar'
    },
    {
       from: /(\w+)\s*, \s*(\w+)/,
       to: function(word, first, second){
           return '' + second + first;
       }
    }
]
```
