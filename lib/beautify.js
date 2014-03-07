/**
 * @file 美化JS、CSS和JSON文件命令
 * @author virola[virola.zhu@gmail.com]
 */

var fs = require('fs');

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
cli.command = 'beautify';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '格式化HTML、JS、CSS和JSON文件';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [
    'output:',
    'indent:',
    'type:'
];

/**
 * @param {Array.<string>} args 命令行参数.
 * @param {Object} opts 可选选项
 */
cli.main = function(args, opts) {
    require('./util').require(
        'edp-beautify',
        function ( error, cmd ) {
            !error && cmd.process(args, opts);
        }
    );
};

exports.cli = cli;
