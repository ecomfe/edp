title: User Commands
categories:
- command-extension
tags:
-  command
-  customize
-  extension
layout:
    layout
date:
    2015-01-03
---

edp默认提供的User Commands包括`edpx-bcs`, `edpx-add`, `edpx-ub-ria`。如果想要创建一个自己的扩展，可以采用如下的方式：

1. git clone https://github.com/ecomfe/edpx-seed.git
2. cd edpx-seed
3. npm link .

此时执行`edp`，就能在User Command的部分看到如下内容了

```
User Commands:
  seed       edp seed command description
   |- foo        这个是必须的，用来简单的描述命令所做的事情
```

然后在edpx-seed的基础上做一些自己的修改即可。
