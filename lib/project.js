/**
 * @file 项目管理模块
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
cli.command = 'project';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '项目管理相关功能。';

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
