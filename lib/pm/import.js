/**
 * @file 导入包模块
 * @author errorrik[errorrik@gmail.com]
 */

var fs = require( 'fs' );
var path = require( 'path' );
var util = require( '../util' );
var project = require( '../project' );

/**
 * 获取依赖包导入目录
 * 
 * @inner
 * @param {string=} dir 当前目录
 * @return {string}
 */
function getImportDir( dir ) {
    dir = dir || process.cwd();
    return path.resolve( project.findDir( dir ) || dir, 'dep' );
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
    return path.resolve( getImportDir( dir ), MANIFEST_FILE );
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
    var importDir = getImportDir( dir );
    var pkgData = getPackageInfo( path.resolve( importDir, name, version ) );
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
            importFromRegistry( dependName + '@' + dependVer, dir, next );
        }
    }

    next();
}

/**
 * 获取package信息
 * 
 * @inner
 * @param {string} dir package目录
 * @return {Object}
 */
function getPackageInfo( dir ) {
    return util.readJson( path.resolve( dir, 'package.json' ) );
}

/**
 * 移动包临时目录到目标目录
 * 
 * @inner
 * @param {string} tempDir 临时目录
 * @return {string} 目标目录
 */
function moveTempToTarget( tempDir ) {
    var pkgData = getPackageInfo( tempDir );
    var name = pkgData.name;
    var version = pkgData.version;

    var importDir = path.resolve( tempDir, '..' );
    var target = path.resolve( importDir, name, version );
    if ( fs.existsSync( target ) ) {
        fs.rmdirSync( tempDir );
    }
    else {
        require( 'mkdirp' ).sync( path.resolve( importDir, name ) );
        fs.renameSync( tempDir, target );
    }

    return target;
}

/**
 * 从registry导入包
 * 
 * @param {string} name 包名称
 * @param {string=} dir 导入目录
 * @param {Function=} callback 回调函数
 */
function importFromRegistry( name, dir, callback ) {
    var importDir = getImportDir( dir );
    var fetch = require( './fetch' );
    fetch( name, importDir, function ( error, data ) {
        if ( error ) {
            throw error;
        }

        var name = data.name;
        var version = data.version;

        if ( isPackageExists( name, version, dir ) ) {
            fs.unlinkSync( data.path );
            callback && callback( null, {
                name: name,
                version: version
            });
            return;
        }

        importFromFile( data.path, dir, function( error, pkg ) {
            fs.unlinkSync( data.path );
            callback && callback( error, pkg );
        } );
    } );
}

/**
 * 从本地文件导入包
 * 
 * @param {string} name 包名称
 * @param {string=} dir 导入目录
 * @param {Function=} callback 回调函数
 */
function importFromFile( file, dir, callback ) {
    var importDir = getImportDir( dir );
    var tempDir = path.resolve( importDir, util.getTempFileName() );

    var extractMethod;
    switch ( path.extname( file ).slice( 1 ) ) {
        case 'gz':
        case 'tgz':
            extractMethod = 'extractTgz';
            break;
        case 'zip':
            extractMethod = 'extractZip';
            break;
    }

    extractMethod && util[ extractMethod ]( 
        file, 
        tempDir, 
        function () {
            var target = moveTempToTarget( tempDir );
            var pkgData = getPackageInfo( target );
            addPackage( 
                {
                    name: pkgData.name, 
                    version: pkgData.version,
                    main: pkgData.main || 'main'
                }, 
                dir 
            );
            importDependencies( 
                pkgData.name, 
                pkgData.version, 
                function () {
                    project.updateModuleConfFile( dir );
                    require( '../project/loader' ).updateConfig( dir );
                    callback && callback( null, pkgData );
                } 
            );
        }
    );
}


exports.fromFile = importFromFile;
exports.fromRegistry = importFromRegistry;
exports.getImportedPackages = getImportedPackages;

