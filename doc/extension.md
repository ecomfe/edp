自定义扩展
--------


edp允许用户通过自定义扩展，并加入自己定制的命令。


### 添加扩展目录

通过下面的命令可以添加一个新的扩展目录。未指定扩展目录时，默认将添加当前目录`.`。

    $ edp extension add [directory]

如果添加的扩展是一个npm package，则需要使用`package`下的`lib`目录添加扩展，避免直接添加`package`的根目录。



### 移除扩展目录

通过下面的命令可以移除扩展目录。未指定扩展目录时，默认将移除当前目录`.`。

    $ edp extension remove [directory]


### 定制命令

edp在运行时，将自动扫瞄并载入所有扩展目录中的`.js`文件。扫瞄过程中，如果发现文件模块暴露了`cli`属性，则认为该文件提供了命令行命令。`cli`对象支持如下属性：

- `{string} command` : 命令名称。
- `{string} description` : 命令描述。
- `{string} usage` : 命令用法。
- `{Array} options` : 命令选项。数组中的每一项为选项名（如`global`），如果需要值则以半角冒号结尾（如`output:`）。
- `{function(Array, Object)} main` : 命令运行入口。

一个NodeJs模块，其暴露的命令所属层级，取决于其相对扩展目录的目录结构层级。
