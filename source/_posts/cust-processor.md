title: 自定义 Processor
categories:
- build
tags:
-  build
layout:
    layout
date:
    2015-01-16
---

有时，内置的Processor没法满足我们的需求。EDP BUILD的`配置文件`是一个`node module`。我们可以很灵活的在`配置文件`中自定义自己的Processor。在下面的章节里，我们简单介绍了`Processor的运行过程`，然后提供了`通过Object自定义processor`和`从AbstractProcessor继承自定义processor`的例子

## Processor的运行过程

[构建过程](Build#%E6%9E%84%E5%BB%BA%E8%BF%87%E7%A8%8B)中，构建主模块通过`Processor`的实例方法`start(processContext, callback)`，与`Processor`发生交互。`Processor`执行完成后，调用由构建主模块传入的`callback`，通知主模块当前`Processor`处理已经完成。

`Processor`的`start`方法做三件事情：

1. 调用实例方法`beforeAll(processContext)`。该方法默认实现为`根据files属性选取当前processor要处理的文件集`
2. 根据选取的文件集，挨个调用实例方法`process(file, processContext, callback)`
3. 调用实例方法`afterAll(processContext)`。该方法默认不做任何事情，需要后续处理的processor可以实现该方法

大多数情况下，自定义自己的Processor都是为了对文件内容做一些自己的处理，这时候只需要重写process方法。我们来看看`process`方法的参数：

### file

`FileInfo`。EDP Build在读入文件时，会把文件包装成`FileInfo`对象，你可以通过`setData`方法更改数据内容。最后，EDP Build会根据这个`FileInfo`对象的状态进行输出。

该对象包含以下属性：

- data - 文件数据，文本文件时data为`string`，二进制文件时data为`Buffer`
- extname - 文件扩展名
- path - 文件路径，相对于构建目录
- fullPath - 文件完整路径
- fileEncoding - 文件的文本编码类型
- outputPath - 输出路径，修改此项可以更改文件输出目标

### processContext

`ProcessContext`。构建处理运行时，该对象包含一些运行的基本环境信息。

- baseDir - 构建基础目录
- exclude - 构建排除文件列表
- outputDir - 构建输出目录
- fileEncodings - 文件编码表

### callback

`function`。当前文件处理完成的回调函数。

由于处理过程可能是异步的（比如less只提供了异步编译接口），所以，处理完成后需要手工调用`callback`，告诉EDP`当前文件的处理已经完成`。

## 通过Object自定义processor

下面，我们通过编写一个简单的`StringReplacer`，介绍了如何自定义自己的processor：

### 只需要一步：在getProcessor方法中，使用`JS plain Object`

`getProcessors`方法返回的是处理器实例数组。如果其中的项是一个`JS plain Object`，构建主模块会自动让其具有默认的行为。

自定义Processor的Object中，我们必须包含`name`项，EDP在输出当前Build的过程时，会用到这个属性。我们可以根据自己的需求，选择复写`start`、`process`、`beforeAll`、`afterAll`。

```javascript
exports.getProcessors = function () {
    return [
        new LessCompiler({
            // ...
        }),
        new CssCompressor({
            // ...
        }),
        // 通过`JS plain Object`自定义processor
        {
            files: [ 'index.html' ],
            from: 'oldvalue',
            to: 'newvalue',
            name: 'StringReplacer',
            process: function (file, processContext, callback) {
                if (this.from && this.to) {
                    file.setData(
                        file.data.replace(from, to)
                    );
                }

                callback();
            }
        }
    ];
};
```

至此，我们已经完成了`StringReplacer`的开发和使用。

## 从AbstractProcessor继承自定义processor

和上面的章节一样，下面通过编写一个简单的`StringReplacer`，介绍了如何自定义自己的Processor：

### 第一步：写一个类，并继承于AbstractProcessor

`配置文件`被EDP加载后，将通过`injectProcessor`方法往配置模块的`global`中注入`内置Processors`，其中包含了processor的抽象类`AbstractProcessor`。我们需要编写自己的Processor类，并通过原型继承的方式，从`AbstractProcessor`继承。

```javascript
function defineStringReplacer() {
    function StringReplacer(options) {
        AbstractProcessor.call(this, options);
    }

    StringReplacer.prototype = new AbstractProcessor();
    StringReplacer.prototype.name = 'StringReplacer';
    return StringReplacer;
}
```

我们需要为自己的Processor指定一个name，EDP在输出当前Build的过程时，会用到这个属性。

注意：由于EDP在加载完`配置模块`后，才会进行`内置Processors`注入，所以直接在配置模块的下编写Processor类并继承会失败，因为这时`AbstractProcessor`还没有被注入。所以Processor类应编写在一个function内，并在未来执行（见第三步）。

### 第二步：编写process方法

我们可以根据自己的需求，选择复写`start`、`process`、`beforeAll`、`afterAll`。在当前场景下，我们只需要编写`process`方法：

```javascript
function defineStringReplacer() {
    function StringReplacer(options) {
        AbstractProcessor.call(this, options);
    }

    StringReplacer.prototype = new AbstractProcessor();
    StringReplacer.prototype.name = 'StringReplacer';
    StringReplacer.prototype.process = function (file, processContext, callback) {
        if (this.from && this.to) {
            file.setData(
                file.data.replace(from, to)
            );
        }

        callback();
    };

    return StringReplacer;
}
```


### 第三步：使用自己的Processor

我们可以在`getProcessors`方法中，初始化自己的Processor类，并使用它。

```javascript
exports.getProcessors = function () {
    var StringReplacer = defineStringReplacer();

    return [
        new LessCompiler({
            // ...
        }),
        new CssCompressor({
            // ...
        }),
        new StringReplacer({
            files: [ 'index.html' ],
            from: 'oldvalue',
            to: 'newvalue'
        })
    ];
};
```

至此，我们已经完成了`StringReplacer`的开发和使用。