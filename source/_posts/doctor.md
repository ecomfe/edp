title: Doctor
categories:
- Doctor
tags:
-  doctor
layout:
    layout
date:
    01-01
---

通常，一个前端项目如果出现了一些不符合预期的问题，可以通过诊断工具`edp doctor`帮你定位并解决这些问题。诊断工具会检查如下的内容：

1. output输出的内容中引用的资源是否存在
2. 项目的配置是否正常（是否存在.edpproj目录，是否存在module.conf文件）
3. module.conf的配置是否正确
4. 项目代码中require所引用的module id是否正确
5. 项目代码中所引用的资源是否正确
6. 项目代码的模板中是否存在重名的target