/**
 * @file edp控制中心
 * @author errorrik[errorrik@gmail.com]
 * @module lib/edp
 */

/**
 * edp版本信息
 *
 * @type {string}
 */
exports.version = '1.0.0';

/**
 * 用户定义模块的目录
 * 
 * @inner
 * @const
 * @type {string}
 */
var MODULE_DIR = 'edp_modules';

/**
 * 获取用户home目录名
 * 
 * @return {string}
 */
exports.getHome = function () {
    return process.env[
        require( 'os' ).platform() === 'win32' 
            ? 'HOMEPATH'
            : 'HOME'
    ];
};

/**
 * 获取用户定义模块home目录
 * 
 * @return {string}
 */
exports.getUserModuleDir = function () {
    return require( 'path' ).resolve( exports.getHome(), MODULE_DIR );
};

