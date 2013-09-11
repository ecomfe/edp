beautify
---------

### Usage

    edp beautify <filename> [-o targetfile]


### Description

格式化`JS`、`CSS`或`JSON`文件，输出格式化之后的内容。建议指定输出文件`-o`

例如：

    edp beautify a.css  -o a.format.css
    edp beautify b.js   -o b.format.js
    edp beautify c.json -o c.format.json

*注意*： 目前对`js`文件的格式化会保留文件注释，但不会保留空行。

