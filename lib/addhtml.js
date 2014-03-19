/**
 * @file 添加html文件命令
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
cli.command = 'addhtml';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '添加html文件';

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 */
cli.main = function ( args, opts ) {
    require('./util').require(
        'edp-add',
        function ( error, cmd ) {
            !error && cmd.start(['html'].concat(args), opts);
        }
    );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
