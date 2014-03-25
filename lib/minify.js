/**
 * @file 使用minify命令来让js、css、json文件获得最小化的输出。
 * @author ielgnaw(wuji0223@gmail.com)
 */

/**
 * 命令行配置项
 *
 * @inner
 * @type {Object}
 */
var cli = {};

/**
 * @const
 * @type {string}
 */
cli.command = 'minify';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = ['output:', 'name:', 'type:'];

/**
 * @const
 * @type {string}
 */
cli.description = '使用minify命令来让js、css、json文件获得最小化的输出。';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp minify <input> [--type/-t=file] [--output/-o=outputDir] [--name/-n=name]';

/**
 * @param {Array.<string>} args 命令行参数.
 * @param {Object.<string, string>} opts 命令的可选参数.
 */
cli.main = function(args, opts) {
    require('./util').require(
        'edp-minify',
        function ( error, cmd ) {
            !error && cmd.start(args, opts);
        }
    );
};

exports.cli = cli;