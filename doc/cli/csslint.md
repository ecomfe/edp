csslint
---------
### Usage

    edp csslint [target]

### Description

使用`csslint`对`当前目录`下所有CSS代码进行检测。检测结果将输出markdown格式的报告。

如果`当前目录`或`子目录`下包含`.csslintrc`文件，则检测过程使用该用户配置，否则使用edp默认配置。

#### 配置文件格式

配置文件命名统一为`.csslintrc`。

考虑到可读性，配置文件使用`JSON`格式，不兼容`csslint`官方的 CLI Arguments 式配置，例如：

```
{
    "box-model": false,
    "import": false,
    "outline-none": false,
    "duplicate-background-images": false
}
```

配置规则与可用配置项请参考：
https://github.com/stubbornella/csslint/wiki/Rules