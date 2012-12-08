/**
 * @file 配置模块
 * @author errorrik[errorrik@gmail.com]
 * @module lib/config
 */

var fs = require( 'fs' );

/**
 * config file path
 * 
 * @const
 * @type {string}
 */
var RC_PATH = process.env.HOME + '/.edprc';

/**
 * 命令名称
 *
 * @type {string}
 */
exports.command = 'config';

/**
 * 模块描述信息
 *
 * @type {string}
 */
exports.description = 'Get and set config options.';

/**
 * 模块初始化
 *
 * @param {Object} context 运行环境
 */
exports.init = function ( context ) {
    context.commander
        .command( exports.command )
        .description( exports.description )
        .action( context.processor.packMain( exports.main ) );
};

/**
 * 获取配置信息对象
 * 
 * @ignore
 * @return {Object}
 */
function getConf() {
    var conf = {};

    if ( fs.existsSync( RC_PATH ) ) {
        conf = JSON.parse( fs.readFileSync( RC_PATH, "UTF-8" ) );
    }

    return conf;
}

/**
 * 模块运行入口
 *
 * @param {Array} commands 运行命令
 * @param {Object} args 运行参数
 */
exports.main = function ( commands, args ) {
    if ( commands.length > 0 ) {
        var name = commands[ 0 ];
        var value = commands[ 1 ];

        if ( typeof value == 'undefined' || value === null ) {
            value = exports.get( name );
            console.log( value );
        }
        else {
            exports.set( name, value );
            console.log( '"' + name + '" is setted.')
        }
    }
};

/**
 * 获取配置项的值
 * 
 * @param {string} name 配置项名称
 * @return {string}
 */
exports.get = function ( name ) {
    var conf = getConf();
    return conf[ name ];
};

/**
 * 设置配置项的值
 * 
 * @param {string} name 配置项名称
 * @param {string} value 配置项的值
 */
exports.set = function ( name, value ) {
    var conf = getConf();
    conf[ name ] = value;
    fs.writeFileSync( RC_PATH, JSON.stringify( conf ), "UTF-8" );
};

