extension
---------

### Usage

    edp extension add [directory]
    edp extension remove [directory]
    
### Description

自定义扩展，允许用户`加入/移除`自己定制的扩展与edp命令。

+ edp extension add - 添加一个新的扩展目录，不指定`directory`则默认为`当前目录`。
+ edp extension remove - 移除扩展目录，不指定`directory`则默认为`当前目录`。

edp在运行时，将自动扫瞄所有添加的`扩展目录`下的NodeJS模块，如果模块包含暴露的`cli`对象，则认为该模块为包含用户`自定义命令`。其`自定义命令`所属层级，取决于其相对`扩展目录`的目录结构层级。

*如果添加的扩展是一个npm package，则需要使用package下的lib目录添加扩展，避免直接添加package的根目录。*

#### cli对象

`cli`对象支持如下属性：

- `{string} command` - 命令名称。
- `{string} description` - 命令描述。
- `{string} usage` - 命令用法。
- `{Array} options` - 命令选项。数组中的每一项为选项名（如`global`），如果需要值则以半角冒号结尾（如`output:`）。
- `{function(Array, Object)} main` - 命令运行入口。

下面是`cli`对象的示例（不含注释）：

    var cli = {};
    exports.cli = cli;

    cli.command = 'addjs';
    cli.options = ['id:', 'type:'];
    cli.description = '添加javascript文件';
    cli.usage = 'edp addjs <jsfile> [--type=function|object]';

    cli.main = function ( args, opts ) {
        var jsFile = args[ 0 ];
        if ( !jsFile ) {
            console.log( '请输入javascript文件名' );
            return;
        }

        var data = {};
        switch ( opts.type ) {
            case 'function':
                data.functionModule = true;
                break;
            case 'object':
                data.objectModule = true;
                break;
        }

        addjs( jsFile, data );
    };




