webserver
---------

### Usage

    edp webserver start
    edp webserver start [--port=portNo]
    edp webserver start [--config=configFile]
    edp webserver start [--document-root=documentRoot]
    edp webserver start [--weinre-host=weinreHost]
    edp webserver start [--weinre-port=weinrePort]
    edp webserver start [--weinre-flag=weinreFlag]


### Options

+ --port - 启动的端口号，不指定则按照配置文件中配置的端口号启动，默认配置文件的端口配置为`8848`。
+ --config - 启动的配置文件，不指定则使用默认配置文件。
+ --document-root - 文档根路径，不指定则使用配置文件中的文档根路径。
+ --weinre-host - weinre服务的ip地址或域名，不指定则使用当前主机的ip。
+ --weinre-port - weinre服务的端口号，不指定则使用默认端口`8080`。
+ --weinre-flag - weinre服务的标记，用于区分不同的调试任务。


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


#### 启用 weinre 支持

`weinre`主要用于移动端调试，需要单独启动，可通过`npm install -g weinre`安装。

启动`weinre`时，通常需要添加`--boundHost -all-`参数，以支持所有ip。

启动WebServer时，添加`--weinre-host`、`--weinre-port`、`--weinre-flag`任一参数均可启用`weinre`支持。

例如：

    edp webserver start --weinre-host 172.21.203.28 --weinre-port 8787 --weinre-flag project1

启动后会有如下提示：

    EDP WebServer start, root = [/opt/projects/project1], listen = [8848]
    Inject Weinre script, debug client UI: http://172.21.203.28:8787/client/#project1

通过`http://172.21.203.28:8787/client/#project1`即可调试当前WebServer下的页面。
