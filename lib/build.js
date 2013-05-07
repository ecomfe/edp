/**
 * @file 构建功能的命令行执行
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
cli.command = 'build';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '构建目录或项目';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp build [--output=outputDir]';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [
    'output:'
];

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 * @param {Object} opts 命令运行选项
 */
cli.main = function ( args, opts ) {
    var build = require( './builder/main' );
    var pwd = process.cwd();
    var output = opts.output;

    if ( !output ) {
        var path = require( 'path' );
        output = path.resolve( pwd, '..', path.basename( pwd ) + '-output' );
    }

    var fs = require( 'fs' );
    if ( fs.existsSync( output ) ) {
        throw new Error( output + ' directory is exist!' );
    }
    fs.mkdirSync( output );

    build( pwd, output );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
