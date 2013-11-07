webserver
---------

### Usage

    edp webserver start
    edp webserver start [--port=portNo]
    edp webserver start [--config=configFile]
    edp webserver start [--document-root=documentRoot]

### Options

+ --port - 启动的端口号，不指定则按照配置文件中配置的端口号启动，默认配置文件的端口配置为`8848`。
+ --config - 启动的配置文件，不指定则使用默认配置文件。
+ --document-root - 文档根路径，不指定则使用配置文件中的文档根路径。


### Description

用于调试的WebServer。

WebServer的配置是一个NodeJS风格的Javascript模块。WebServer运行时将向`配置模块`注入`资源处理方法`，并把`配置模块`嵌入运行环境中。

默认的`配置文件`查找方式为：从`当前目录`向上查找，发现目录下包含`edp-webserver-config.js`文件时，将其作为`配置文件`。如果找不到`配置文件`，则以`默认配置文件`启动。


#### 配置WebServer

配置模块 *必须* 包含暴露的`injectRes`方法。

    exports.injectRes = function ( res ) {
        for ( var key in res ) {
            global[ key ] = res[ key ];
        }
    };

配置文件允许暴露的成员如下：

##### port 

启动端口号

##### documentRoot

文档根目录

##### directoryIndexes

是否允许显示目录内文件列表


##### getLocations

返回Location的处理器列表的方法，列表的每项是包含location和handler的Object。

下面是默认的配置，供定制配置的同学参考：

    exports.getLocations = function () {
        return [
            { 
                location: '/', 
                handler: home( 'index.html' )
            },
            { 
                location: /^\/redirect-local/, 
                handler: redirect('redirect-target', false) 
            },
            { 
                location: /^\/redirect-remote/, 
                handler: redirect('http://www.baidu.com', false) 
            },
            { 
                location: /^\/redirect-target/, 
                handler: content('redirectd!') 
            },
            { 
                location: '/empty', 
                handler: empty() 
            },
            { 
                location: /\.less$/, 
                handler: [
                    file(),
                    less()
                ]
            },
            { 
                location: /^.*$/, 
                handler: [
                    file(),
                    proxyNoneExists()
                ]
            }
        ];
    };

