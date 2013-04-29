/**
 * @file 添加扩展
 * @author errorrik[errorrik@gmail.com]
 */

// TODO: if add a npm package dir, auto add `lib` dir

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
cli.command = 'add';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '添加扩展目录';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp extension add <dir>';

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 */
cli.main = function ( args ) {
    var extension = require( '../extension' );
    var path = require( 'path' );
    var cwd = process.cwd();

    args.forEach( function ( dir ) {
        dir = path.resolve( cwd, dir );
        extension.add( dir );
    } );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
