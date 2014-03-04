minify
---------

### Usage

    edp minify <inputFile> [--output=outputFile]
    edp minify <inputFile> [-o outputFile]


### Description

最小化`JS`、`CSS`或`JSON`文件，以便获得最小化的输出。

支持文件后缀名(extname)：`.htm`、`.html`、`.js`、`.css`、`.json`，如果没有文件后缀名，则默认使用`.js`

如果不指定输出文件，则默认使用input.compiled.extname作为输出文件，且保存于与输入文件同级的目录中

如果同名文件存在，则会覆盖旧文件

例如：
    
    edp minify a.css -o a.compiled.css
    edp minify a.css // 输出为a.compiled.css
    edp minify b.js // 输出为b.compiled.js
    edp minify b // 读取b.js 并输出为b.compiled.js
    edp minify c.json -o cc.json
    edp minify d.html -o dd.html


#### 默认压缩引擎
+ `JS`：使用[uglifyJS](https://github.com/mishoo/UglifyJS)
+ `CSS`：使用[uglifyCSS](https://github.com/fmarcia/UglifyCSS)
+ `JSON`：使用JSON.stringify & JSON.parse
+ `HTML`：使用[html-minifier](https://github.com/kangax/html-minifier)
