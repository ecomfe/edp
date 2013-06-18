/**
 * @file 导入包模块
 * @author errorrik[errorrik@gmail.com]
 */

var fs = require( 'fs' );
var path = require( 'path' );
var util = require( '../util' );
var semver = require( 'semver' );
var project = require( '../project' );

/**
 * 获取依赖包导入的基础目录
 * 当前目录位于项目目录下时，以项目目录作为基础目录
 * 否则，以当前目录作为基础目录
 * 
 * @inner
 * @param {string=} dir 当前目录
 * @return {string}
 */
function getBaseDir( dir ) {
    dir = dir || process.cwd();
    var baseDir = project.findDir( dir ) || dir;

    return path.resolve( baseDir );
}

/**
 * 获取依赖包导入目录
 * 导入目录为基础目录下的dep目录
 * 
 * @inner
 * @param {string=} dir 当前目录
 * @return {string}
 */
function getImportDir( dir ) {
    var baseDir = getBaseDir( dir );
    return path.join( baseDir, 'dep' );
}

/**
 * 已导入包manifest信息文件名
 * 
 * @const
 * @inner
 * @type {string}
 */
var MANIFEST_FILE = 'packages.manifest';

/**
 * 获取包信息的manifest文件
 * 
 * @inner
 * @param {string=} dir 当前目录
 * @return {string}
 */
function getManifestFile( dir ) {
    return path.join( getImportDir( dir ), MANIFEST_FILE );
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
 * 获取已定义的依赖包
 * 
 * @inner
 * @param {string} dir 当前目录
 * @return {Object}
 */
function getDefinedDependencies( dir ) {
    var baseDir = getBaseDir( dir );
    var pkgFile = path.join( baseDir, 'package.json' );
    var metaFile = project.getMetadataFile( baseDir );

    if ( fs.existsSync( pkgFile ) ) {
        return util.readJson( pkgFile ).dependencies;
    }
    else if ( metaFile && fs.existsSync( metaFile ) ) {
        return util.readJson( metaFile ).dependencies;
    }

    return null;
}

/**
 * 添加依赖包声明
 * 
 * @inner
 * @param {string} name 依赖包名称
 * @param {string} version 依赖包版本
 * @param {string=} dir 当前目录
 */
function addDefinedDependency( name, version, dir ) {
    var baseDir = getBaseDir( dir );
    var pkgFile = path.join( baseDir, 'package.json' );
    var metaFile = project.getMetadataFile( baseDir );

    var data;
    var targetFile;
    if ( fs.existsSync( pkgFile ) ) {
        data = util.readJson( pkgFile );
        targetFile = pkgFile;
    }
    else if ( metaFile && fs.existsSync( metaFile ) ) {
        data = util.readJson( metaFile );
        targetFile = metaFile;
    }

    if ( !data ) {
        return;
    }

    var depData = data.dependencies;
    if ( !depData ) {
        depData = data.dependencies = {};
    }

    if ( !depData[ name ] ) {
        depData[ name ] = version;
    }

    util.writeJson( targetFile, data );
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
    util.writeJson( getManifestFile( dir ), packages );
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

    return semver.maxSatisfying( existVers, version );
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
    callback = callback || new Function();
    var importDir = getImportDir( dir );
    var pkgData = getPackageInfo( path.resolve( importDir, name, version ) );
    var dependencies = pkgData.dependencies;
    var dependNames = Object.keys( dependencies || {} );

    var i = -1;
    var len = dependNames.length;

    function next( error ) {
        if ( error ) {
            console.log( 'Import dependency "' + dependNames[ i ] + '" fail!' );
        }

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
    callback = callback || new Function();
    var importDir = getImportDir( dir );
    var fetch = require( './fetch' );

    fetch( name, importDir, function ( error, data ) {
        if ( error ) {
            callback( error, data );
            return;
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
            callback( error, pkg );
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
            var pkgName = pkgData.name;
            var pkgVersion = pkgData.version;

            addPackage( 
                {
                    name: pkgName, 
                    version: pkgVersion,
                    main: pkgData.main || 'main'
                }, 
                dir 
            );
            addDefinedDependency( 
                pkgName, 
                pkgVersion.split( '.' )[ 0 ] + '.x',
                dir
            );

            importDependencies( 
                pkgName, 
                pkgVersion, 
                function () {
                    project.updateModuleConfFile( dir );
                    require( '../project/loader' ).updateConfig( dir );
                    callback && callback( null, pkgData );
                } 
            );
        }
    );
}

/**
 * 更新包
 * 
 * @param {string=} name 包名称
 * @param {string=} dir 导入目录
 * @param {Function=} callback 回调函数
 */
function update( name, dir, callback ) {
    callback = callback || new Function();
    var importeds = getImportedPackages();
    var definedDeps = getDefinedDependencies() || {};

    // 具名更新或批量更新的预处理
    var updatesMap;
    var updatesLen = -1;
    if ( name ) {
        updatesMap = {};
        updatesMap[ name ] = definedDeps[ name ];
    }
    else {
        updatesMap = definedDeps;
    }
    updates = Object.keys( updatesMap );

    /**
     * 异步更新step函数
     * 
     * @inner
     */
    function next() {
        if ( ++updatesLen >= updates.length ) {
            callback();
            return;
        }

        var dep = updates[ updatesLen ];
        var depVersion = updatesMap[ dep ];
        var registry = require( '../pm' ).getRegistry();
        registry.get(
            dep,
            function ( error, data ) {
                if ( error ) {
                    console.log( 'Cannot update package "' + dep + '"!');
                    next();
                    return;
                }

                var maxImportedVer = Object.keys( importeds[ dep ] || {} )
                    .sort( semver.rcompare )[ 0 ] || '0.0.0';
                var ver = semver.maxSatisfying( 
                    Object.keys( data.versions || {} ), 
                    depVersion
                );

                if ( semver.gt( ver, maxImportedVer ) ) {
                    importFromRegistry( dep + '@' + ver, dir, next );
                }
            }
        )
    }
    
    next();
}

exports.update = update;
exports.fromFile = importFromFile;
exports.fromRegistry = importFromRegistry;
exports.getImportedPackages = getImportedPackages;

