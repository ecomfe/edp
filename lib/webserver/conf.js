/**
 * @file WevServer默认配置
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com],
 *         ostream[ostream.song@gmail.com]
 */

// 端口
exports.port = 8848;

// 网站根目录
exports.documentRoot = process.cwd();

// 当路径为目录时，是否显示文件夹内文件列表
exports.directoryIndexes = true;

// less 包含文件存放地址，可以是绝对路径，也可以是相对路径(相对于网站根目录)
exports.lessIncludePaths = [];

// handlers
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
            location: /^\/jn\/combine\/all\.css/,
            handler: jnCombineCss()
        },
        {
            location: /^\/jn\/combine\/tpl\.html/,
            handler: jnCombineTpl()
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

exports.injectRes = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
