/**
 * @file 包查询功能
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
cli.command = 'search';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '查询现有的包';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp pm search [keyword]';

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 */
cli.main = function ( args ) {
    var keyword = args[ 0 ] || '';
    require( './pm/search' )( keyword, function ( error, data ) {} );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
