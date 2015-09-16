title: 查找当前存在的包
categories:
- package-management
tags:
-  package
layout:
    layout
date:
    2015-01-24
---
通过edp的`search`命令：`edp search [keyword]`，可以查找当前存在的包。如果不输入`keyword`，将列出当前存在的所有包。

```
$ edp search under

NAME                  AUTHOR     VERSIONS   DATE

bs-edu-store          ecomfe     1.3.14     2014-02-10 02:06
store                 firede     1.3.9      2013-06-20 05:19
underscore            firede     1.5.2      2013-11-26 10:24
underscore.string     firede     2.3.1      2013-06-20 05:17
```

如果不想通过命令，可以直接在[edp的网站](http://edp.baidu.com/)上查找和浏览存在的包。