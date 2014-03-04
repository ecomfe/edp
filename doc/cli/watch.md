watch
---

### Usage

    edp watch
    edp watch [task-group]
    edp watch [task-group] [--config=confFile]

### Options

+ task-group - 想要执行的任务组，默认值为 `default`。
+ --config - 指定监视的配置文件。

### Description

用于监视文件变化，以执行预定任务。

Watch 需要预先配置才能使用，它的配置是一个 NodeJS 风格的 JavaScript 模块。
Watch 运行时将向 `配置模块` 注入执行任务的 `插件`，并把 `配置模块` 嵌入运行环境中。

默认的 `配置文件` 查找方式为：从 `当前目录` 向上查找，发现目录下包含 `edp-watch-config.js` 文件时，将其作为 `配置文件`。如果找不到 `配置文件`，Watch 将无法启动。

#### 配置 Watch

配置模块 *必须* 包含暴露的 `injectPlugin` 方法：

    exports.injectPlugin = function( plugins ) {
        for ( var key in plugins ) {
            global[ key ] = plugins[ key ];
        }
    };

##### baseDir

配置模块 *必须* 指定 `baseDir`，Watch 会监视这个目录下的所有文件变化，如：

    exports.baseDir = __dirname;

##### getTasks

返回 Tasks 的过滤规则与启用的插件对象，对象的 key 为 `任务名`，value 是配置对象。

配置对象包含 `filters`（过滤规则）、`events`（监听事件）、`plugins`（处理插件）。

下面是一个参考配置：

    exports.getTasks = function() {
        return {
            'livereload': {
                filters: [
                    '*.(html|js|coffee|less|styl|css)',
                    '!node_modules/*',
                    '!.(git|svn)/*'
                ],
                events: [
                    'addedFiles',
                    'modifiedFiles'
                ],
                plugins: livereload()
            },
            // more tasks...
        }
    };

更多帮助请参考：

+ [过滤规则详解](https://github.com/ecomfe/edp-watch/issues/2)

##### getGroups

返回任务组划分对象，Watch 执行时会监视指定任务组下的所有任务，默认任务组为 `default`。

下面是一个参考配置：

    exports.getGroups = function() {
        return {
            'default': [ 'livereload' ],
            'dev': [ 'jshint', 'csslint', 'htmlhint' ]
        }
    };

