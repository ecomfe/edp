title: Builtin Commands
categories:
- command-extension
tags:
-  command
-  builtin commands
layout:
    layout
date:
    2015-01-05
---


edp提供的命令分为Builtin Commands和User Commands，各个命令的实现分别由不同的npm package来完成。



根据package.json里面的配置，我们可以了解到edp提供的Builtin Commands和npm package的对应关系如下：

```json
{
  "edp": {
    "extensions": {
      "edp-core": [ "install" ],
      "edp-config": [ "config" ],
      "edp-build": [ "build" ],
      "edp-package": [ "import", "search", "update" ],
      "edp-project": [ ],
      "edp-webserver": [ ],
      "edp-watch": [ ],
      "edp-lint": [ "htmlhint", "csslint", "jshint" ],
      "edp-beautify": [ "beautify" ],
      "edp-doctor": [ "doctor" ],
      "edp-minify": [ "minify" ],
      "edp-test": [ "test" ]
    }
  }
}
```

例如当我们执行`edp install`的时候，首先edp会检查是否安装了edp-core这个npm package，如果没有的话，会自动安装，安装成功之后会执行install这个命令，执行的时候会传递必要的参数给install这个命令。
