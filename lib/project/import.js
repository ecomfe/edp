/**
 * @file 项目导入依赖包模块
 * @author errorrik[errorrik@gmail.com]
 * @module lib/project/import
 */

var fs = require( 'fs' );
var path = require( 'path' );
var util = require( '../util' );
var project = require( '../project' );

/**
 * 获取项目lib目录
 * 
 * @inner
 * @return {string}
 */
function getLibDir() {
    return path.resolve( project.findDir(), './lib' );
}

/**
 * 导入依赖包
 * 
 * @inner
 * @param {string} name 包名称
 * @param {string} version 包版本
 * @param {Function} callback 导入完成回调函数
 */
function importDependencies( name, version, callback ) {
    callback = callback || function () {};
    var pkgJson = [ '.', name, version, 'package.json'].join( '/' );
    var libDir = getLibDir();
    var pkgData = util.readJson( path.resolve( libDir, pkgJson ) );
    var dependencies = pkgData.dependencies;
    var dependNames = Object.keys( dependencies || {} );

    var i = -1;
    var len = dependNames.length;

    function next() {
        if ( ++i >= len ) {
            callback();
            return;
        }

        var dependName = dependNames[ i ];
        var dependVer = dependencies[ dependName ];
        
        var pkgDir = path.resolve( libDir, './' + dependName );
        var vers = [];
        if ( fs.existsSync( pkgDir ) ) {
            vers = fs.readdirSync( pkgDir );
        }
        
        if ( require( 'semver' ).maxSatisfying( vers, dependVer ) ) {
            next();
        }
        else {
            importPackage( dependName + '@' + dependVer, next );
        }
    }

    next();
}

/**
 * 导入包
 * 
 * @param {string} name 包名称
 * @param {Function} callback 回调函数
 */
function importPackage( name, callback ) {
    callback = callback || function () {};
    var libDir = getLibDir();

    var fetch = require( '../pm/fetch' );
    fetch( name, libDir, function ( data ) {
        var name = data.name;
        var version = data.version;

        util.unpack( 
            data.path,
            path.resolve( libDir, './' + name + '/' + version ),
            function () {
                fs.unlinkSync( data.path );
                importDependencies( name, version, callback );
            } );
    } );
}

module.exports = exports = importPackage;

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
cli.command = 'import';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '为项目导入依赖包';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp project import <package>';

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 */
cli.main = function ( args ) {
    var name = args[ 0 ];
    importPackage( name );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
