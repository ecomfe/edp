
## 配置processors

在读入文件后，edp将使用`getProcessors`方法提供的processors逐一对每个读入的文件进行处理，经过processors处理后的文件再统一通过build的output模块进行输出与文件写入。

```javascript
exports.getProcessors = function () {
    return [ 
        new LessCompiler( {
            entryExtnames: pageEntries
        } ), 
        new CssCompressor(),
        new ModuleCompiler( {
            configFile: 'module.conf'
        } ), 
        new JsCompressor()
    ];
};
```

上面的例子中，`LessCompiler`、`CssCompressor`、`ModuleCompiler`、`JsCompressor`均为edp内置的processor，在下面将有详细介绍。

processor之间的处理顺序是敏感的，比如CSS压缩的处理应该在LESS编译的处理之后。


## 内置processor

edp build内置了一些常用的processor，可以满足大部分系统的构建需求。

### 创建processor实例

通过 `new ProcessorConstructor( {Object=}options )` 可以创建一个processor的实例，其中options为processor的参数。

每个内置的processor，都支持传入exclude和include参数，对processor处理的文件进行选择与过滤。

关于exclude和include规则字符串的匹配规则，请参考[gitignore的pattern format](https://www.kernel.org/pub/software/scm/git/docs/gitignore.html)。

#### options.exclude

通过设置 `options.exclude` 可以使processor不对一些文件执行处理。 `options.exclude`是一个数组，数组的每项是一个规则的字符串。

```javascript
new JsCompressor({
    exclude: [
        '/exclude/path1'
    ]
})
```

#### options.include

通过设置 `options.include` 可以使processor加入对一些文件执行处理。 `options.include`的主要作用是与`options.exclude`配合使用，进行更精细的处理文件选择。

```javascript
new JsCompressor({
    exclude: [
        '/exclude/*'
    ],
    include: [
        '/exclude/main.js'
    ]
})
```

### LessCompiler

LessCompiler用于对Less进行编译。当前使用的Less版本为1.4.2。

#### options.entryExtnames

指定入口文件后缀名列表。LessCompiler将自动扫瞄这些文件，并将其中对`.less`的引用替换成编译后的`.css`。

未来可能使用新的`entry`参数实现此功能。

#### options.compileOptions

通过该参数可以自定义Less编译选项。详细的编译选项请参考[Less的文档](http://lesscss.org/#usage)。默认如下：

```javascript
{
    paths: [ require( 'path' ).dirname( file.fullPath ) ],
    relativeUrls: true
}
```

### CssCompressor

CssCompressor用于对CSS进行压缩。当前使用clean-css的1.1.0。

#### options.compressOptions

通过该参数可以自定义clean-css的压缩选项。详细的压缩选项请参考[clean-css的文档](https://github.com/GoalSmashers/clean-css)。


### ModuleCompiler

ModuleCompiler用于对AMD模块进行编译。

#### options.configFile

用于指定模块的配置文件。模块文件路径查找，模块合并等编译时所需信息都通过模块配置文件声明。该文件必须是一个严格的JSON文件，通常为`module.conf`，允许包含`baseUrl`、`paths`、`packages`、`combile`项。下面是一个简单示例：


```javascript
{
    "baseUrl": "src",
    "paths": {},
    "packages": [
        {
            "name": "er",
            "location": "dep/er/3.0.2/src",
            "main": "main"
        }
    ],
    "combine": {
        "main2": 1,
        "main" : {
            "include": [
                "user/config",
                "plan/config",
                "route/config",
                "idea/config",
                "keyword/config",
                "report/config",
                "common/accountTree",
                "common/navigator",
                "common/require-ui",
                "common/require-tpl"
            ]
        }
    }
}
```

需要额外说明的是`combine`项，通过该项可以指定模块编译时将其直接或间接依赖的模块合并到自身，从而减少http请求数。其值为1或true时按默认规则合并，为包含include或exclude的Object时可指定合并时将相应模块添加或排除。

### JsCompressor

JsCompressor用于对Javascript进行压缩。当前使用uglifyjs的2.3.6。

*由于Javascript压缩耗时较大，可以使用exclude选项将一些不需要压缩的文件清除出去，提高build效率。*


#### options.compressOptions

通过该参数可以自定义uglifyjs的压缩选项。详情请参考[uglifyjs的文档](http://lisperator.net/uglifyjs/compress)

#### options.mangleOptions

通过该参数可以自定义uglifyjs的变量名混淆选项。 *该选项不建议更改* 。

### MD5Renamer

MD5Renamer用于将静态资源文件名编译成其内容的md5摘要。虽说叫MD5Renamer，但其处理策略是增加一个内容相同的以md5摘要值命名的文件，以保证资源引用替换不充分时系统运行的正确性。

```javascript
new MD5Renamer( {
    files:[
        'src/main.less'
    ],
    replacements: {
        html: [
            'index.html'
        ]
    }
} )
```

#### options.files

需要进行md5摘要处理的文件列表，规则与exclude参数项相同。

#### options.replacements

指定对相关资源的替换，现支持html相关标签引用的替换和css url的替换。

##### options.replacements.abspaths

指定绝对路径对构建本地路径的映射关系。未指定abspaths时，所有绝对路径引用都将不被替换。

##### options.replacements.css

指定要替换的css文件列表数组。数组每项可以是string，也可以是包含file和paths项的object。

列表声明的每一个文件，其内部url引用的资源如果被MD5Renamer处理，则被替换成处理后的路径。

```javascript
[
    'src/common/main.css',
    {
        file: 'src/common/main2.css',
        paths: [
            'src'
        ]
    }
]
```

##### options.replacements.html

指定要替换的html文件列表数组。参数规则和`options.replacements.css`相同。


### PathMapper

PathMapper用于对静态资源的路径进行映射和替换。常用于将src的资源映射到asset。

```javascript
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
```

#### options.from

映射源路径片段

#### options.to

映射目标路径片段

#### options.replacements

对文件内容资源进行替换的参数。上面的例子表示的是：

1. 替换html中link标签的href引用
2. 替换html中img标签的src引用
3. 替换html中script标签的src引用
4. 替换模块配置中的路径


### VariableSubstitution

VariableSubstitution用于对文件内容进行简单的变量替换。该processor将替换文件内容中`{edp-variable:{variableName}}`的部分。

#### options.variables

声明variables的值。

```javascript
new VariableSubstitution( {
    variables: {
        version: '1.0.0'
    }
} )
```


### ManifestCompiler

ManifestCompiler用于给文件增加manifest属性、以及生成*.appcache文件。

```javascript
new ManifestCompiler( {
    configFile: 'module.conf',
    manifests: [
        { 
            cachePage: 'main.html', 
            autoCache: false,
            manifestName: 'main.appcache', 
            cache: [
                'asset/file2.js' , 
            ],
            fallback: [
                '/ offline.html'
            ], 
            network: [ 
                'asset/css/color.css'
            ] 
        },
        { 
            cachePage: 'page/*', 
            prefixPath: '../',
            manifestName: 'page.appcache', 
            fallback: [
                '/ ../offline.html'
            ], 
            network: [ 
                'asset/css/color.css'
            ] 
        }
    ]
} )
```

#### options.configFile

用于指定模块的配置文件。与ModuleCompiler中的参数相同。

#### options.manifests

生成manifest文件的配置数组

#### options.manifests.cachePage

缓存文件路径(支持通配符)，缓存文件根目录是`output`

#### options.manifests.autoCache

自动缓存资源，若不需要自动缓存资源，指定值为`false`，默认值为`true`

#### options.manifests.manifestName

manifest文件名

#### options.manifests.prefixPath

当缓存文件不在edp project init后的文件夹下时，需要指定该参数，使资源的根目录是`output`。例如，缓存文件在page文件夹下，则prefixPath的值为`../`。缓存文件在page/page文件夹下，则prefixPath的值为`../../`

#### options.manifests.cache

cache部分资源(资源路径是用`output`作为起始目录)，请参考[concept-appcache-manifest-explicit](http://www.whatwg.org/specs/web-apps/current-work/multipage/offline.html#concept-appcache-manifest-explicit)。

#### options.manifests.fallback

fallback部分资源(资源路径是用`output`作为起始目录)，请参考[concept-appcache-manifest-fallback](http://www.whatwg.org/specs/web-apps/current-work/multipage/offline.html#concept-appcache-manifest-fallback)。

#### options.manifests.network

network部分资源(资源路径是用`output`作为起始目录)，请参考[concept-appcache-manifest-network](http://www.whatwg.org/specs/web-apps/current-work/multipage/offline.html#concept-appcache-manifest-network)。

上面的manifests中的例子依次表示的是：

1. `output`路径下的main.html增加manifest属性，manifest文件名为main.appcache，不自动缓存资源，指定缓存资源为asset/file2.js，当前页面(main.html)无法访问时的替代资源是offline.html，从不缓存的资源是asset/css/color.css
2. `output`路径下的page文件下的所有文件增加manifest属性，资源文件前缀是`../`，manifest文件名为page.appcache，自动缓存资源，当前页面(main.html)无法访问时的替代资源是offline.html，从不缓存的资源是asset/css/color.css



## 自定义processor

edp build自带的processor可能满足不了你的需求，这时候你可以定制自己的processor，就像用Javascript写一个简单的类。有两点需要注意的：

1. 最好从edp提供的`AbstractProcessor`继承，这样定制的processor将直接获得exclude和include筛选的能力。
2. 在getProcessors中而不是global下，因为`AbstractProcessor`等内建的processor是模块加载完后被inject的。
3. 在prototype中提供一个`name`属性，在构建的输出中会被print出来，便于跟踪构建过程。
4. 实现`process`方法 *function ( file, processContext, callback )*，该方法在edp构建时将被自动调用。
5. `process`方法处理完成后，手工调用callback。

下面是一个简单的例子，将文件中的“联通”字样替换成“移动”：

```javascript
exports.getProcessors = function () {
    function TestReplacer( options ) {
        AbstractProcessor.call( this, options );
    }
    TestReplacer.prototype = new AbstractProcessor();
    TestReplacer.prototype.name = 'TestReplacer';
    TestReplacer.prototype.process = function ( file, processContext, callback ) {
        file.setData( file.data.replace( /联通/g, '移动' ) );
        callback();
    };

    return [ 
        new TestReplacer()
    ];
};
```





