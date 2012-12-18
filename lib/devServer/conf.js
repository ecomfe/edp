/**
 * @file 默认配置
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com]
 * @module lib/devServer/conf
 */

exports.injectRes = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};

exports.locations = [
    { 
        location: '/', 
        handler: file('index.html') 
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
        location: /^.*$/, 
        handler: file() 
    }
];
