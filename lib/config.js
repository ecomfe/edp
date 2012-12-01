/**
 * @file 配置模块
 * @author errorrik[errorrik@gmail.com]
 * @module lib/config
 */

/**
 * 命令名称
 *
 * @type {string}
 */
exports.command = 'config';

/**
 * 模块描述信息
 *
 * @type {string}
 */
exports.description = 'Get and set config options.';

/**
 * 模块初始化
 *
 * @param {Object} context 运行环境
 */
exports.init = function ( context ) {
	context.commander
        .command( exports.command )
        .description( exports.description )
        .action( context.processor.packMain( exports.main ) );
};

/**
 * 模块运行入口
 *
 * @param {Array} commands 运行命令
 * @param {Object} args 运行参数
 */
exports.main = function ( commands, args ) {
	console.log( commands );
	console.log( args );
};

