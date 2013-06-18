/**
 * @file 项目初始化调试服务器配置
 * @author errorrik[errorrik@gmail.com]
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
cli.command = 'initWebServer';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '初始化项目的调试服务器配置';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp project initWebServer';

/**
 * 模块命令行运行入口
 */
cli.main = function () {
    var project = require( '../project' );
    project.createWebserverConfFile();
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
