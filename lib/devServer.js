/**
 * @file 开发时web调试服务器
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com]
 * @module lib/devServer
 */

// TODO: move port to conf, add docroot conf
// TODO: auto find conf file
// TODO: make res handle not end response
// TODO: add lesscss support
// TODO: css auto merge when import more than 32


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
    var port = args.port || 80;
    var server = require( './devServer/server' );
    server.start( port, requireConf() );
};


function requireConf() {
    var conf = require( './devServer/conf' );
    conf.injectRes( require( './devServer/res' ) );

    return conf;
}



