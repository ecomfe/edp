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
 * @ignore
 * @type {string}
 */
var RC_FILE = require( 'path' ).resolve(
    require( './edp' ).getHome(),
    '.edprc' 
);

/**
 * 获取配置信息对象
 * 
 * @ignore
 * @return {Object}
 */
function getConf() {
    var conf = {};

    if ( fs.existsSync( RC_FILE ) ) {
        conf = JSON.parse( fs.readFileSync( RC_FILE, 'UTF-8' ) );
    }

    return conf;
}

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
    fs.writeFileSync( RC_FILE, JSON.stringify( conf ), 'UTF-8' );
};


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
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '读取和设置edp用户配置';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp config <name> [value]';

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 */
cli.main = function ( args ) {
    var name = args[ 0 ];
    var value = args[ 1 ];

    if ( !value ) {
        console.log( exports.get( name ) );
    }
    else {
        exports.set( name, value );
        console.log( '"' + name + '" is setted.');
    }
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;


