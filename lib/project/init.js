/**
 * @file 项目初始化模块
 * @author errorrik[errorrik@gmail.com]
 * @module lib/project/init
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
cli.command = 'init';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '初始化当前目录为项目目录';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp project init';

/**
 * 模块命令行运行入口
 */
cli.main = function () {
    var project = require( '../project' );
    project.init();
    project.initDir();
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
