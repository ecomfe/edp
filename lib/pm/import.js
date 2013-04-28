/**
 * @file 导入包模块
 * @author errorrik[errorrik@gmail.com]
 * @module lib/pm/import
 */

var fs = require( 'fs' );
var path = require( 'path' );
var util = require( '../util' );
var project = require( '../project' );

/**
 * 获取项目lib目录
 * 
 * @inner
 * @param {string=} dir 当前目录
 * @return {string}
 */
function getLibDir( dir ) {
    dir = dir || process.cwd();
    return path.resolve( project.findDir( dir ) || dir, './lib' );
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
 * @param {string=} dir 当前目录
 * @return {string}
 */
function getManifestFile( dir ) {
    return path.resolve( getLibDir( dir ), MANIFEST_FILE );
}

/**
 * 获取当前已经导入的包列表
 * 
 * @inner
 * @param {string=} dir 当前目录
 * @return {Object}
 */
function getImportedPackages( dir ) {
    var manifestFile = getManifestFile( dir );
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
 * @param {string=} dir 当前目录
 */
function addPackage( pkg, dir ) {
    var name = pkg.name;
    var packages = getImportedPackages( dir );

    if ( !packages[ name ] ) {
        packages[ name ] = {};
    }

    packages[ name ][ pkg.version ] = pkg;
    fs.writeFileSync( 
        getManifestFile( dir ),
        util.stringifyJson( packages ),
        'UTF-8'
    );
}

/**
 * 判断包在当下是否存在
 * 
 * @inner
 * @param {string} name 包名称
 * @param {string} version 包版本
 * @param {string=} dir 当前目录
 * @return {boolean}
 */
function isPackageExists( name, version, dir ) {
    var existPkgs = getImportedPackages( dir );
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
 * @param {string=} dir 导入目录
 */
function importDependencies( name, version, callback, dir ) {
    callback = callback || function () {};
    var pkgJson = [ '.', name, version, 'package.json' ].join( '/' );
    var libDir = getLibDir( dir );
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
        
        if ( isPackageExists( dependName, dependVer, dir ) ) {
            next();
        }
        else {
            importPackage( dependName + '@' + dependVer, next, dir );
        }
    }

    next();
}

/**
 * 导入包
 * 
 * @param {string} name 包名称
 * @param {Function} callback 回调函数
 * @param {string=} dir 导入目录
 */
function importPackage( name, callback, dir ) {
    callback = callback || function () {};

    var libDir = getLibDir( dir );
    var fetch = require( './fetch' );
    fetch( name, libDir, function ( error, data ) {
        if ( error ) {
            throw error;
        }

        var name = data.name;
        var version = data.version;

        if ( isPackageExists( name, version, dir ) ) {
            fs.unlinkSync( data.path );
            callback( null, {
                name: name,
                version: version
            });
            return;
        }

        util.unpack( 
            data.path,
            path.resolve( libDir, './' + name + '/' + version ),
            function () {
                fs.unlinkSync( data.path );
                var pkg = {
                    name: name,
                    version: version
                };
                addPackage( pkg, dir );
                importDependencies( name, version, function () {
                    project.updateModuleConfFile( dir );
                    require( '../project/loader' ).updateConfig( dir );
                    callback( null, pkg );
                } );
            } );
    } );
}

module.exports = exports = importPackage;
exports.getImportedPackages = getImportedPackages;

