/**
 * @file 包管理功能模块
 * @author errorrik[errorrik@gmail.com]
 * @module lib/pm
 */

/**
 * 默认的registry地址
 * 
 * @inner
 * @const
 * @type {string}
 */
var DEFAULT_REGISTRY = 'http://registry.edp.baidu.com/';

/**
 * 获取registry地址
 * 
 * @return {string} 
 */
exports.getRegistryUrl = function () {
    return require( './config' ).get( 'registry' ) || DEFAULT_REGISTRY;
};

/**
 * registry cache目录名
 * 
 * @const
 * @type {string}
 */
var CACHE_DIR = '.cache';

/**
 * 获取registry cache目录
 * 
 * @inner
 * @return {string} 
 */
function getCacheDir() {
    var parentDir = require( './edp' ).getUserModuleDir();
    return require( 'path' ).resolve( parentDir, CACHE_DIR );
}

// 初始化registry cache目录
require( 'mkdirp' ).sync( getCacheDir() );

/**
 * 获取registry client配置
 * 
 * @inner
 * @return {Object}
 */
function getRegistryConf() {
    return { 
        'loglevel'   : 'warn',
        'cache'      : getCacheDir(),
        'registry'   : exports.getRegistryUrl(), 
        'strict-ssl' : false, 
        '_auth'      : '', 
        'username'   : '', 
        '_password'  : '',
        'email'      : '' 
    };
}

/**
 * registry client对象
 * 
 * @inner
 * @type {RegClient}
 */
var registry;

/**
 * 初始化registry client对象
 * 
 * @inner
 */
function initRegistry() {
    if ( !registry ) {
        var RegClient = require( 'npm-registry-client' );
        registry = new RegClient( getRegistryConf() );
    }
}

/**
 * 获取registry client对象
 * 
 * @return {RegClient}
 */
exports.getRegistry = function () {
    initRegistry();
    return registry;
};

var cli = {};
cli.command = 'pm';
cli.description = '包管理功能集';
cli.usage = 'edp pm <command> [args]';
cli.main = function () {};

exports.cli = cli;
