/**
 * @file 项目导入依赖包模块的命令行执行
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
cli.command = 'import';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '导入包';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp import <package>';

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 */
cli.main = function ( args ) {
    var name = args[ 0 ];
    if (!name) {
        console.error(cli.usage);
        process.exit(0);
    }
    require( './pm/import' )( name );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
