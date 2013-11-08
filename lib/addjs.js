/**
 * @file 添加javascript文件的脚手架命令
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
cli.command = 'addjs';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = ['id:', 'type:'];

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '添加javascript文件';

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 * @param {Object} opts 命令运行选项
 */
cli.main = function ( args, opts ) {
    var jsFile = args[ 0 ];
    if ( !jsFile ) {
        console.log( '请输入javascript文件名' );
        return;
    }

    var config = require( 'edp-config' );
    var data = {
        moduleId: opts.id || 'exports',
        author: config.get( 'user.name' ),
        email: config.get( 'user.email' ),
        file: '[Please input file description]',
        moduleDescription: '[Please input module description]'
    };

    switch ( opts.type ) {
        case 'function':
            data.functionModule = true;
            break;
        case 'object':
            data.objectModule = true;
            break;
    }

    require( 'edp-codegen' ).js( data, jsFile );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
