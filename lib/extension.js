/**
 * @file 扩展管理功能模块
 * @author errorrik[errorrik@gmail.com]
 */

var config = require( 'edp-config' );

/**
 * extension配置项名称
 * 
 * @inner
 * @const
 * @type {string}
 */
var CONF_NAME = 'extension_dirs';

/**
 * 获取扩展模块的目录列表
 * 
 * @return {Array}
 */
exports.get = function () {
    return config.get( CONF_NAME ) || [];
};

/**
 * 添加扩展模块目录
 * 
 * @param {string} dir 扩展模块目录
 */
exports.add = function ( dir ) {
    var extensions = exports.get();
    var len = extensions.length;
    while ( len-- ) {
        if ( extensions[ len ] === dir ) {
            throw new Error( dir + ' is exists.' );
        }
    }

    extensions.push( dir );
    config.set( CONF_NAME, extensions );
};

/**
 * 删除扩展模块目录
 * 
 * @param {string} dir 扩展模块目录
 */
exports.remove = function ( dir ) {
    var extensions = exports.get();
    var len = extensions.length;
    while ( len-- ) {
        if ( extensions[ len ] === dir ) {
            extensions.splice( len, 1 );
        }
    }

    config.set( CONF_NAME, extensions );
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
cli.command = 'extension';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '扩展管理相关功能。';

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
