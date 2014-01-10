/**
 * @file edp用到的工具函数
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com], 
 *         leeight[leeight@gmail.com], 
 *         firede[firede@firede.us],
 *         treelite[c.xinle@gmail.com]
 */

/**
 * 对象属性拷贝
 * 
 * @param {Object} target 目标对象
 * @param {...Object} source 源对象
 * @return {Object} 返回目标对象
 */
exports.extend = function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var src = arguments[i];
        if (src == null) {
            continue;
        }
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                target[key] = src[key];
            }
        }
    }
    return target;
};

/**
 * 混合对象
 * 
 * @param {...Object} source 要混合的对象
 * @return {Object} 混合后的对象
 */
exports.mix = function () {
    var o = {};
    var src = Array.prototype.slice.call(arguments);
    return exports.extend.apply(this, [o].concat(src));
};

exports.clone = function ( source ) {
    return JSON.parse( JSON.stringify( source ) );
};

/**
 * @param {string} targetUrl The request url.
 * @param {{data:Object, headers:Object,
 *     multipart:boolean, file:Object}} options The post options.
 * @param {function(Error, http.ServerResponse,
 *     string)} callback The post handler.
 */
exports.httpPost = function(targetUrl, options, callback) {
    var url = require('url');
    var http = require('http');
    var path = require('path');
    var fs = require('fs');
    var querystring = require('querystring');

    var headers = exports.extend({}, options.headers);
    var postBody;
    if (options.multipart) {
        // var boundery = 'acrossthegreatwallwecanreacheverycornerintheworld';
        var boundery = '----------ae0Ef1Ef1ei4KM7ei4ae0ae0ei4cH2';
        postBody = [];
        if (options.data) {
            for(var key in options.data) {
                postBody.push(new Buffer(
                    '--' + boundery + '\r\n' +
                    'Content-Disposition: form-data; name="' + key + '"\r\n' +
                    '\r\n' +
                    options.data[key] + '\r\n'
                ));
            }
            if (options.file && fs.existsSync(options.file.path)) {
                postBody.push(new Buffer(
                    '--' + boundery + '\r\n' +
                    'Content-Disposition: form-data; name="' +
                    options.file.name + '"; ' +
                    'filename="' + path.basename(options.file.path) + '"\r\n' +
                    'Content-Type: application/octet-stream\r\n' +
                    '\r\n'
                ));
                postBody.push(fs.readFileSync(options.file.path));
                postBody.push(new Buffer('\r\n'));
            }
            postBody.push(new Buffer('--' + boundery + '--'));
            postBody = Buffer.concat(postBody);
        }
        headers['Content-Type'] = 'multipart/form-data; boundary=' + boundery;
        headers['Content-Length'] = postBody.length;
    } else {
        postBody = typeof options.data === 'string' ? options.data :
            querystring.stringify(options.data || {});
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        headers['Content-Length'] = Buffer.byteLength(postBody);
    }

    var o = url.parse(targetUrl);
    o['method'] = 'POST';
    o['headers'] = headers;
    var req = http.request(o, function(res){
        res.setEncoding('utf8');
        var chunks = [];
        res.on('data', function(chunk){
            chunks.push(chunk);
        });
        res.on('end', function(){
            callback(null, res, chunks.join(''));
        });
    });
    req.on('error', function(e){
        callback(e, null);
    });
    req.write(postBody);
    req.end();
};


exports.path = (function () {
    function normalize( sourcePath ) {
        return sourcePath.replace( /\\/g, '/' );
    }

    var path = require( 'path' );
    var normalizePath = {};

    [
        'normalize',
        'join',
        'resolve',
        'relative',
        'dirname',
        'basename',
        'extname'
    ].forEach(
        function ( method ) {
            normalizePath[ method ] = function () {
                 return normalize( 
                    path[ method ].apply( path, arguments ) 
                );
            };
        }
    );

    return normalizePath;
})();


/**
 * 将json数据序列化成字符串
 * 主要用于配置信息数据输出
 * 
 * @param {JSON} json 数据
 * @return {string}
 */
exports.stringifyJson = function ( json ) {
    return JSON.stringify( json, null, 4 );
};


/**
 * 压缩Javascript代码
 * 
 * @param {string} code Javascript源代码
 * @return {string} 
 */
exports.compressJavascript = function ( code ) {
    var UglifyJS = require( 'uglify-js' );
    var ast = UglifyJS.parse( code );

    // compressor needs figure_out_scope too
    ast.figure_out_scope();
    ast = ast.transform( UglifyJS.Compressor() );

    // need to figure out scope again so mangler works optimally
    ast.figure_out_scope();
    ast.compute_char_frequency();
    ast.mangle_names( { 
        except: [ '$', 'require', 'exports', 'module' ] 
    } );

    return ast.print_to_string();
};


/**
 * 删除目录
 * 
 * @param {string} path 目录路径
 */
exports.rmdir = function ( path ) {
    var fs = require( 'fs' );

    if ( fs.existsSync( path ) && fs.statSync( path ).isDirectory() ) {
        fs.readdirSync( path ).forEach(
            function ( file ) {
                var fullPath = require( 'path' ).join( path, file );
                if ( fs.statSync( fullPath ).isDirectory() ) {
                    exports.rmdir( fullPath );
                }
                else {
                    fs.unlinkSync( fullPath );
                }
            }
        );

        fs.rmdirSync( path );
    }
};

/**
 * 根据功能将文字色彩化
 * 
 * @param {string} text 源文字
 * @param {string} type 功能类型
 * @return {string}
 */
exports.colorize = function ( text, type ) {
    var chalk = require( 'chalk' );
    var colorBrushes = {
        info: chalk.grey,
        success: chalk.green,
        warning: chalk.yellow,
        error: chalk.red,
        title: chalk.cyan.bold,
        link: chalk.blue.underline
    };
    var fn = colorBrushes[ type ] || chalk.stripColor;

    return fn(text);
};


/**
 * 对 child_process.spawn 的包装
 * 
 * @param {string} command 要支持的命令
 * @param {?Array.<string>} args 要传递给 command 的参数列表
 * @property {?Object} options 配置项
 * @return {ChildProcess} 同原 spawn 的返回对象
 */
exports.spawn = function () {
    var spawn = require( 'child_process' ).spawn;
    if ( process.env.comspec ) {
        return function ( command, args, options ) {
            return spawn(
                process.env.comspec,
                [ '/c', command ].concat( args ),
                options
            );
        }
    }
    else {
        return function ( command, args, options ) {
            return spawn( command, args, options );
        }
    }
}();

/**
 * 加载外部模块，未安装时自动安装，模块安装成功后回调
 * 
 * @param {string} moduleId 模块 id，本地模块不支持 ~ 前缀形式
 * @param {Function} callback 模块安装完成或已安装时的回调函数
 */
exports.require = function ( moduleId, callback ) {
    var fs = require( 'fs' );
    var path = require( 'path' );

    var basename = path.basename(moduleId).replace(/@.*$/, '');
    var modulePath = path.join( __dirname, '..', 'node_modules', basename );
    var callbackWrapper = function ( error ) {
        if ( !error ) {
            callback( null, require( basename ) );
        }
        else {
            callback( error, null );
        }
    };
    
    if ( !fs.existsSync( modulePath ) ) {
        var child = exports.spawn(
            'npm',
            ['install', moduleId],
            {
                stdio: 'inherit',
                cwd: __dirname
            },
            callbackWrapper
        );
        child.on('close', callbackWrapper);
    }
    else {
        process.nextTick( callbackWrapper );
    }
}
