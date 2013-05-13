/**
 * @file 内建资源处理方法集合
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com]
 */

var fs          = require( 'fs' );
var path        = require( 'path' );
var less        = require( 'less' );
var util        = require( '../util' );
var mimeType    = require( './mimeTypes' );

/**
 * 输出
 * 
 * @return {Function}
 */
exports.write = function () {
    return function ( context ) {
        var response = context.response;
        var request  = context.request;
        var header   = context.header;
        var extname  = path.extname( request.pathname ).slice( 1 );

        if ( context.status == 200 && !header[ 'Content-Type' ] ) {
            header[ 'Content-Type' ] = mimeType[ extname ];
        }

        response.writeHeader( context.status, context.header );
        context.content && response.write( context.content );
        context.end();
    };
};

/**
 * 列出文件夹内文件
 *
 * @param {string=} dir 文件夹路径
 * @return {Function}
 */
exports.listDirectory = function(dir) {
    return function (context) {
        var docRoot  = context.conf.documentRoot;
        var pathname = context.request.pathname;
        var dirPath = dir || docRoot + pathname;
        var handlebars = require('handlebars');

        context.stop();
        fs.readdir(dir, function(err, files) {
            var list = [];
            files.forEach(function(file) {
                var stat = fs.statSync(path.join(dir, file));
                list.push({
                    'name': stat.isDirectory() ? file + '/' :  file,
                    'url': encodeURIComponent(file) + (stat.isDirectory() ? '/' : ''),
                    'size': stat.size,
                    'mtime': stat.mtime,
                });
            });

            var tplStr = fs.readFileSync(path.resolve(__dirname, 'dirlist.handlebars'), 'utf8');
            var tpl = handlebars.compile(tplStr);
            var html = tpl({
                'files' : list
            });
            context.status = 200;
            context.header[ 'Content-Type' ] = mimeType.html;
            context.content = html;
            context.start();
        });
    };
};

/**
 * 读取文件
 * 
 * @param {string=} file 文件名
 * @return {Function}
 */
exports.file = function ( file ) {
    return function ( context ) {
        var docRoot  = context.conf.documentRoot;
        var pathname = context.request.pathname;
        var filePath = file || docRoot + pathname;

        context.stop();
        fs.stat(filePath, function(error, stats){
            var toStart = true;
            if (!error) {
                if (stats.isDirectory()) {
                    if (!filePath.match(/\/$/)) {
                        context.status = 302;
                        context.header[ 'Location' ] = path.relative(docRoot, filePath) + '/';
                    }
                    else {
                        exports.listDirectory(filePath)(context);
                        toStart = false;
                    }
                }
                else {
                    var content = fs.readFileSync( filePath );
                    context.content = content;
                }
            }
            else {
                context.status = 404;
            }
            toStart && context.start();
        });
    };
};

/**
 * 主索引页
 * 
 * @param {string|Array} file 索引页文件名
 * @return {Function}
 */
exports.home = function ( file ) {
    return function ( context ) {
        var docRoot  = context.conf.documentRoot;
        var pathname = context.request.pathname;

        var files;
        if ( file instanceof Array ) {
            files = file;
        }
        else if ( typeof file == 'string' ) {
            files = [ file ];
        }

        if ( file ) {
            for ( var i = 0; i < files.length; i++ ) {
                var filePath = docRoot + pathname + files[ i ];
                if ( fs.existsSync( filePath ) ) {
                    var content = fs.readFileSync( filePath );
                    context.content = content;
                    return;
                }
            }
        }

        context.status = 404;
    };
};

/**
 * 设置Content-Type头
 * 
 * @param {string=} contentType contentType
 * @return {Function}
 */
exports.contentType = function ( contentType ) {
    return function ( context ) {
        if ( contentType ) {
            context.header[ 'Content-Type' ] = contentType;
        }
    };
};

/**
 * 设置头
 * 
 * @param {Object} header response头
 * @return {Function}
 */
exports.header = function ( header ) {
    return function ( context ) {
        context.header = util.mix( context.header, header );
    };
};

/**
 * 输出json
 * 
 * @param {JSON} data json数据
 * @return {Function}
 */
exports.json = function ( data ) {
    return function ( context ) {
        context.header[ 'Content-Type' ] = mimeType.json;
        if ( data ) {
            context.content = JSON.stringify( data );
        }
    };
};

/**
 * 输出jsonp
 * 
 * @param {JSON} data json数据
 * @param {string} callbackKey 回调函数的参数名
 * @return {Function}
 */
exports.jsonp = function ( data, callbackKey ) {
    callbackKey = callbackKey || 'callback';

    return function ( context ) {
        var qs     = require( 'querystring' );
        var query  = qs.parse( request.search );
        

        context.header[ 'Content-Type' ] = mimeType.js;
        var fnName  = query[ callbackKey ];
        var content = data ? JSON.stringify( data ) : context.content;
        context.content = fnName + '(' + content + ');';
    };
};

/**
 * 输出请求信息
 * 
 * @return {Function}
 */
exports.dumpRequest = function() {
    return function ( context ) {
        var request = context.request;
        var result = {
            url         : request.url,
            method      : request.method,
            httpVersion : request.httpVersion,
            protocol    : request.protocol,
            host        : request.host,
            auth        : request.auth,
            hostname    : request.hostname,
            port        : request.port,
            search      : request.search,
            hash        : request.hash,
            headers     : request.headers,
            query       : request.query,
            body        : request.bodyBuffer.toString( 'utf8' )
        };

        context.header[ 'Content-Type' ] = mimeType.json;
        context.content = JSON.stringify( result, null, '    ' );
    };
};

/**
 * 推迟输出
 * 
 * @param {number} time 推迟输出时间，单位ms
 * @return {Function}
 */
exports.delay = function ( time ) {
    return function ( context ) {
        context.stop();
        setTimeout(
            function() { 
                context.start();
            },
            time
        );
    };
};

/**
 * 输出内容
 * 
 * @param {string} content 要输出的内容
 * @return {Function}
 */
exports.content = function ( content ) {
    return function ( context ) {
        context.content = content;
    };
};

/**
 * 输出重定向
 * 
 * @param {string} location 重定向地址
 * @param {boolean} permanent 是否永久重定向
 * @return {Function}
 */
exports.redirect = function ( location, permanent ) {
    return function ( context ) {
        context.status = permanent ? 301 : 302;
        context.header[ 'Location' ] = location;
    };
};

/**
 * 输出空内容
 * 
 * @return {Function}
 */
exports.empty = function () {
    return exports.content( '' );
};

/**
 * 处理less输出
 * 
 * @param {string} encoding 源编码方式
 * @return {Function}
 */
exports.less = function ( encoding ) {
    return function ( context ) {
        var docRoot  = context.conf.documentRoot;
        var pathname = context.request.pathname;
        // TODO: configurable ?
        var importPath = docRoot + path.dirname( pathname ).replace( /\/$/, '');
        var parser = new( less.Parser )( {
            paths: [ importPath ]
        } );
        context.stop();

        parser.parse( 
            context.content.toString( encoding || 'utf8' ),
            function ( error, tree ) {
                if ( error ) {
                    context.status = 500;
                }
                else {
                    context.header[ 'Content-Type' ] = mimeType.css;
                    context.content = tree.toCSS();
                }

                context.start();
            }
        );
    };
};

/**
 * 对本地找不到响应的请求，试图从通过代理发起请求
 *
 * @return {Function}
 */
exports.proxyNoneExists = function() {
    return function(context) {
        if (context.status == 404) {
            exports.proxy()(context);
        }
    };
};

/**
 * http代理
 * 
 * @param {string} hostname 主机名，可为域名或ip
 * @param {number=} port 端口，默认80
 * @return {Function}
 */
exports.proxy = function ( hostname, port ) {
    return function ( context ) {
        var request = context.request;
        var proxyMap  = context.conf.proxyMap;
        if (!hostname && !proxyMap) {
            return;
        }
        else if (!hostname) {
            var host = request.headers['host'];
            if (proxyMap[host]) {
                var matched = proxyMap[host].split(':');
                hostname = matched[0];;
                port = matched[1] || port;
            }
            else {
                console.log('Can not find matched host for ' + host);
            }
        }

        context.stop();

        // build request options
        var reqHeaders = request.headers;
        var reqOptions = {
            hostname   : hostname,
            port       : port || 80,
            method     : request.method,
            path       : request.url,
            headers    : reqHeaders
        };
        reqHeaders.host = hostname + ( port ? ':' + port : '' );

        // create request object
        var http = require( 'http' );
        var req = http.request( reqOptions, function ( res ) {
            var content = [];
            res.on( 'data', function ( chunk ) {
                content.push( chunk );
            } );

            res.on( 'end', function () {
                context.content = Buffer.concat( content );
                context.header = res.headers;
                if ( !res.headers.connection ) {
                    context.header.connection = 'close';
                }
                context.status = res.statusCode;
                context.start();
            } );
        } );

        // send request data
        var buffer = context.request.bodyBuffer;
        buffer && req.write( buffer );
        req.end();
    };
};
