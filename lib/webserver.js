/**
 * @file 开发时web调试服务器模块
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com],
 *         ostream[ostream.song@gmail.com],
 *         firede[firede@firede.us]
 */

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
cli.command = 'webserver';

/**
 * 命令缩写
 *
 * @type {string}
 */
cli.alias = 'ws';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '用于开发时调试的WebServer';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = '[sudo ]edp webserver start';

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;

/**
 * @param {Array.<string>} args 命令行参数.
 * @param {Object.<string, string>} opts 命令的可选参数.
 */
cli.main = function ( args, opts ) {
    console.log('Please use `edp webserver start`');
};

