beautify
---------

### Usage

    edp beautify <filename> [--output targetfile] [--indent 4]
    edp beautify <filename> [-o targetfile] [-i 4]


### Description

可选参数包括：

* --output[-o] : 输出文件名。如果缺省，则默认在当前目录生成<文件名>.format.<文件类型>这个文件
* --indent[-i] : 缩进空格的数量。如果缺省，则默认为`4`个
* --type[-t] : 指定文件格式，目前支持`js`, `css`, `html`, 'htm' 。 如果缺省，则默认使用文件的后缀名作为文件类型


格式化`HTML`、`JS`、`CSS`或`JSON`文件，输出格式化之后的内容。建议指定输出文件`-o`

例如：

    edp beautify a.css  -o a.format.css
    edp beautify b.js   -o b.format.js
    edp beautify c.json -o c.format.json
    edp beautify d.html  -o d.format.html

*注意*： 目前对`js`文件的格式化会保留文件注释，但不会保留空行。

