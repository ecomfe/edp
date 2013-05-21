/**
 * @file edp控制中心
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * edp版本信息
 *
 * @type {string}
 */
exports.version = JSON.parse(
    require( 'fs' ).readFileSync( 
        require( 'path' ).resolve( __dirname, '../package.json' ), 'UTF-8'
    )
).version;

/**
 * 获取用户home目录名
 * 
 * @return {string}
 */
exports.getHome = function () {
    return process.env[
        require( 'os' ).platform() === 'win32' 
            ? 'APPDATA'
            : 'HOME'
    ];
};

/**
 * 获取配置文件的路径.
 *
 * @param {string} name 配置文件的名称.
 * @return {string}
 */
exports.getConfig = function(name) {
    var path = require('path');
    return path.resolve(exports.getHome(), name);
};

