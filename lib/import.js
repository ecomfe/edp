/**
 * @file 项目导入依赖包模块
 * @author errorrik[errorrik@gmail.com]
 * @module lib/project/import
 */

var fs = require( 'fs' );
var path = require( 'path' );
var util = require( './util' );
var project = require( './project' );

/**
 * 获取项目lib目录
 * 
 * @inner
 * @return {string}
 */
function getLibDir() {
    return path.resolve( project.findDir() || process.cwd(), './lib' );
}

/**
 * 已导入包manifest信息文件名
 * 
 * @const
 * @inner
 * @type {string}
 */
var MANIFEST_FILE = './packages.manifest';

/**
 * 获取包信息的manifest文件
 * 
 * @inner
 * @return {string}
 */
function getManifestFile() {
    return require( 'path' ).resolve( getLibDir(), MANIFEST_FILE );
}

/**
 * 获取当前存在的包列表
 * 
 * @inner
 * @return {Object}
 */
function getExistPackages() {
    var manifestFile = getManifestFile();
    var fs = require( 'fs' );
    if ( fs.existsSync( manifestFile ) ) {
        return JSON.parse( fs.readFileSync( manifestFile, 'UTF-8' ) );
    }

    return {};
}

/**
 * 添加包信息
 * 
 * @inner
 * @param {Object} pkg 包信息对象
 */
function addPackage( pkg ) {
    var name = pkg.name;
    var packages = getExistPackages();

    if ( !packages[ name ] ) {
        packages[ name ] = {};
    }

    packages[ name ][ pkg.version ] = pkg;
    require( 'fs' ).writeFileSync( 
        getManifestFile(),
        require( './util' ).stringifyJson( packages ),
        'UTF-8'
    );
}

/**
 * 判断包在当下是否存在
 * 
 * @inner
 * @param {string} name 包名称
 * @param {string} version 包版本
 * @return {boolean}
 */
function isPackageExists( name, version ) {
    var existPkgs = getExistPackages();
    var existVers = [];
    if ( existPkgs[ name ] ) {
        existVers = Object.keys( existPkgs[ name ] );
    }

    return !!require( 'semver' ).maxSatisfying( existVers, version );
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
    var pkgJson = [ '.', name, version, 'package.json' ].join( '/' );
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
        
        if ( isPackageExists( dependName, dependVer ) ) {
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

    var fetch = require( './pm/fetch' );
    fetch( name, libDir, function ( error, data ) {
        if ( error ) {
            throw error;
        }

        var name = data.name;
        var version = data.version;

        if ( isPackageExists( name, version ) ) {
            fs.unlinkSync( data.path );
            callback();
            return;
        }

        util.unpack( 
            data.path,
            path.resolve( libDir, './' + name + '/' + version ),
            function () {
                fs.unlinkSync( data.path );
                addPackage( {
                    name: name,
                    version: version
                } );
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
cli.description = '导入包';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp import <package>';

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
