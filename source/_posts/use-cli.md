title: 通过命令行使用
categories:
- initialization
tags:
-  init
layout:
    layout
date:
    2015-01-26
---

安装完成后，可以通过命令行下运行edp命令使用。常见的命令语法是：`edp 子命令 参数`。

```
$ edp config --list
{
    "user.name": "errorrik",
    "user.email": "errorrik@gmail.com",
    "sys.lastchecktime": 1404269293715
}
```

## 查看当前支持的命令列表

初始化安装只会安装很少量最基础的命令，以节省安装的下载时间成本。其他命令（比如查询现有package的search命令）将在运行时自动安装。[看看edp内置哪些命令](https://github.com/ecomfe/edp/wiki/Edp-Commands#builtin-commands)

运行edp将得到当前支持的命令列表：

>$ edp   
Builtin Commands:  
config &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;读取和设置edp用户配置  
install   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;           安装edp的扩展包  
link      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;          Create symlink and debug edp user command  
unlink  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;           Delete the edp user command symlink   

如果想一次性的安装更多的命令，可以使用如下方式：
>$ [sudo] npm i -g edp edp-build edp-webserver edpx-bcs

安装成功之后，执行
>$ edp -v

就可以看到安装的Package了。

**注意：**当执行edp命令的时候，若不存在，第一次会自动安装。如果你在安装edp时，使用了sudo，那么通过执行命令自动安装edp扩展时，也需要带有sudo。例如：  

>sudo edp install edpx-foo  
>sudo edp add  

成功安装了扩展之后，再次使用就不需要带有sudo了。


## 查看命令帮助

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
