/**
 * @file 开发时web调试服务器启动入口
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com]
 * @module lib/webserver/start
 */

/**
 * 加载配置文件
 * 
 * @inner
 * @return {Object}
 */
function loadConf() {
    var currentPath = process.cwd();
    var project = require( '../project' );
    var projectDir = project.findDir( currentPath );
    var confFile = project.getWebserverConfFile( projectDir );

    var fs = require( 'fs' );
    if ( projectDir && fs.existsSync( confFile ) ) {
        return require( confFile );
    }

    return require( './conf' );
}

/**
 * 命令行配置项
 *
 * @inner
 * @type {Object}
 */
var cli = {};

/**
 * 命令名称
 *
 * @type {string}
 */
cli.command = 'start';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '启动EDP WebServer';

/**
 * 模块命令行运行入口
 */
cli.main = function () {
    var conf = loadConf();

    if ( !conf ) {
        console.log( 'Cannot load server config.' );
        return;
    }

    if ( conf.injectRes ) {
        conf.injectRes( require( './res' ) );
    }

    var server = require( '../webserver' );
    server.start( conf );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
