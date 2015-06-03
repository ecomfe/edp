title: 查看命令帮助
categories:
- initialization
tags:
-  commands help
layout:
    layout
date:
    2015-01-25
---

当不确定一个命令的参数或用法时，在命令后加入--help可以查看命令的帮助信息。
>$ edp config --help 
> 
>\## config  
>
>\### Usage  
>
>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  edp config <name> [value]  
>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  edp config --list  
>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  edp config  
>
>\### Options  
>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \* --list - 列出所有用户配置。  
>
>\### Description  
>
>读取和设置edp用户配置。当value未指定时，显示name配置的值；否则设置name配置的值。指定--list参数将列出所有用户配置。