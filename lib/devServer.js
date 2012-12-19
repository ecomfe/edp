/**
 * @file 开发时web调试服务器启动入口
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com]
 * @module lib/devServer
 */

// TODO: make res handle not end response
// TODO: add lesscss support
// TODO: css auto merge when import more than 32
// TODO: add Daemon


/**
 * 命令名称
 *
 * @type {string}
 */
exports.command = 'devServer';

/**
 * 模块描述信息
 *
 * @type {string}
 */
exports.description = 'Web Server for debug when develop.';


/**
 * 模块初始化
 *
 * @param {Object} context 运行环境
 */
exports.init = function ( context ) {
    var action = context.processor.packMain( exports.main );

    context.commander
        .command( exports.command )
        .description( exports.description )
        .action( action );
};

/**
 * 模块运行入口
 *
 * @param {Array} commands 运行命令
 * @param {Object} args 运行参数
 */
exports.main = function ( commands, args ) {
    var conf = loadConf();

    if ( !conf ) {
        console.log( 'Cannot load devServer config.' );
        return;
    }

    if ( conf.injectRes ) {
        conf.injectRes( require( './devServer/res' ) );
    }

    var server = require( './devServer/server' );
    server.start( conf );
};

/**
 * 加载配置文件
 * 
 * @inner
 * @return {Object}
 */
function loadConf() {
    var execPath = process.execPath;
    var path = require( 'path' );
    var fs = require( 'fs' );

    while ( !isRoot( execPath ) ) {
        var edpDir = execPath + '/.edp';
        var confFile = edpDir + '/devServer.js';
        if ( 
            fs.existsSync( edpDir )
            && fs.statSync( edpDir ).isDirectory()
            && fs.existsSync( confFile ) 
        ) {
            return require( confFile );
        }

        execPath = path.normalize( execPath + '/..' );
    }

    return require( './devServer/conf' );
}

/**
 * 判断路径是否到达根目录
 * 
 * @inner
 * @param {string} path 路径
 * @return {boolean}
 */
function isRoot( path ) {
    return path != '/';
}


