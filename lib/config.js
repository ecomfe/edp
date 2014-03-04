/**
 * @file 配置功能命令行执行
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
cli.command = 'config';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [ 'list' ];

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '读取和设置edp用户配置';

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 * @param {Object} opts 命令运行选项
 */
cli.main = function ( args, opts ) {
    var edpConfig = require( 'edp-config' );

    // 如果执行 edp config --list
    // 或者执行 edp config
    // 打印出当前的配置项
    if ( opts.list || (!args.length && !Object.keys(opts).length)) {
        var util = require( './util' );
        console.log( util.stringifyJson( edpConfig.all() ) );
        return;
    }

    var name = args[ 0 ];
    var value = args[ 1 ];

    if ( !value ) {
        console.log( edpConfig.get( name ) );
    }
    else {
        edpConfig.set( name, value );
        console.log( '"' + name + '" is setted.');
    }
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;


