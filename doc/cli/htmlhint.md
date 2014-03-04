htmlhint
---------
### Usage

    edp htmlhint [target]


### Description

使用`htmlhint`对`当前目录`下所有HTML文件代码进行检测。检测结果将输出markdown格式的报告。

如果`当前目录`或`子目录`下包含`.htmlhintrc`文件，则检测过程使用该用户配置，否则使用edp默认配置。

针对标签的配置：

```
[
    {
        element: "a", 
        attributes: { 
            "charset": true,
            "coords": true,
            "download": true,
            "href": true,
            "hreflang": true,
            "media": true,
            "name": true,
            "ping": true,
            "rel": true,
            "rev": true,
            "shape": true,
            "target": true,
            "type": true
        }
    },
    {
        element: "abbr", 
        attributes: { }
    }
]
```

扩展规则配置：

```
[
    {
        on: "div:not([class])",
        test: function(index, element, lint) {
            lint.warn("CLASSLESS_DIV"); 
        }
    },
    { 
        on: "*",
        test: function(index, element, lint) {
            var cls = this.className;
            if(this.hasAttribute('class') && /^\s*$/.test(cls)) {
                lint.warn("EMPTY_CLASS");
            }
        } 
    }
]
```

更多配置暂时可参考：

https://github.com/ecomfe/edp-htmlhint/lib/elements.js

https://github.com/ecomfe/edp-htmlhint/lib/config.js
