title: Command Help
categories:
- Command_extension
tags:
-  command
-  help
layout:
    layout
date:
    01-02
---


所有的命令都支持`edp <cmd> --help`或者`edp <cmd> -h`的参数用来查看命令的帮助信息。  
<del>注意：edp help &lt;cmd&gt;的方式已经不支持了</del>

当输出cmd的帮助信息的时候，优先检查在`cmd.js`的统计目录是否存在`cmd.md`，如果存在的话，直接输出即可，否则会输出c