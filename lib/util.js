/**
 * @file edp用到的工具函数
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com]
 * @module lib/devServer/util
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

/**
 * 编译handlebars模板
 * 
 * @param {string} file 模板文件
 * @param {string=} encoding 编码格式，默认utf-8
 * @return {Function}
 */
exports.compileHandlebars = function ( file, encoding ) {
    encoding = encoding || 'UTF-8';
    var Handlebars = require( 'handlebars' );
    var fs = require( 'fs' );
    var source = fs.readFileSync( file, encoding );

    return Handlebars.compile( source );
};

/**
 * 解压缩tgz文件
 * 
 * @param {string} tarball tgz文件名
 * @param {string} target 解压路径
 * @param {Function} callback 回调函数
 */
exports.unpack = function ( tarball, target, callback ) {
    var zlib = require( 'zlib' );
    var tar = require( 'tar' );
    var fs = require( 'fs' );
    var path = require( 'path' );
    var parentDir = path.resolve( target, '..' );

    require( 'mkdirp' ).sync( parentDir );
    var tmpName = (new Date()).getTime() + Math.random();
    var tmpDir = path.resolve( parentDir, './' + tmpName );

    require( 'fstream' )
        .Reader( { 
            type: 'File',
            path: tarball
        } )
        .pipe( zlib.createGunzip() )
        .pipe( tar.Extract( { path: tmpDir } ) )
        .on(
            'end',
            function () {
                fs.renameSync( 
                    path.resolve( tmpDir, './package' ), 
                    target 
                );
                fs.rmdirSync( tmpDir );
                callback && callback();
            }
        );
};

/**
 * 读取json文件
 * 
 * @param {string} file 文件路径
 * @return {Object} 
 */
exports.readJson = function ( file ) {
    var fs = require( 'fs' );
    var content = fs.readFileSync( file, "UTF-8" );
    if ( content.charCodeAt( 0 ) === 0xFEFF ) {
        content = content.slice(1);
    }

    return JSON.parse( content );
};

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


