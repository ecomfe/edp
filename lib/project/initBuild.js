/**
 * @file 项目初始化构建配置
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
cli.command = 'initBuild';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '初始化项目的构建配置';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp project initBuild';

/**
 * 模块命令行运行入口
 */
cli.main = function () {
    var project = require( '../project' );
    project.createBuildConfFile();
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
