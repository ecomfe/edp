/**
 * @file 项目管理模块
 * @author errorrik[errorrik@gmail.com]
 */

var fs = require( 'fs' );
var path = require( 'path' );

/**
 * 项目配置目录名称
 * 
 * @const
 * @inner
 * @type {string}
 */
var PROJECT_CONF_DIR = '.edpproj';


/**
 * 获取项目所在目录路径
 * 
 * @param {string=} basePath 目录路径
 * @return {string}
 */
exports.findDir = function ( basePath ) {
    basePath = basePath || process.cwd();
    
    while ( basePath ) {
        if ( fs.existsSync( basePath )
             && fs.statSync( basePath ).isDirectory()
        ) {
            var infoDir = path.resolve( basePath, PROJECT_CONF_DIR );
            if ( fs.existsSync( infoDir ) 
                 && fs.statSync( infoDir ).isDirectory() 
            ) {
                return basePath;
            }
            
            var parentPath = path.resolve( basePath, '..' );
            if ( parentPath === basePath ) {
                break;
            }
            basePath = parentPath;
        }
        else {
            break;
        }
    }

    return null;
};

/**
 * 获取项目配置项对应的文件名
 * 
 * @param {string} projectDir 项目目录
 * @param {string} conf 配置项名称
 * @return {string}
 */
exports.getConfFile = function ( projectDir, conf ) {
    var confDir = path.resolve( projectDir, PROJECT_CONF_DIR );

    return path.resolve( confDir, conf );
};

/**
 * 项目metadata配置文件名
 * 
 * @const
 * @inner
 * @type {string}
 */
var METADATA_FILE = 'metadata';

/**
 * 项目默认metadata配置
 * 
 * @const
 * @inner
 * @type {Object}
 */
var DEFAULT_METADATA = {
    wwwroot: '/',
    depDir: 'dep',
    srcDir: 'src',
    loaderAutoConfig: 'js,htm,html,tpl,vm,phtml'
};

/**
 * 获取项目的metadata信息
 * 
 * @param {string=} basePath 目录路径
 * @return {Object} 
 */
exports.getMetadata = function ( basePath ) {
    var projectDir = exports.findDir( basePath );

    if ( projectDir ) {
        return JSON.parse( 
            fs.readFileSync( 
                exports.getConfFile( projectDir, METADATA_FILE ), 
                'UTF-8' 
            )
        );
    }

    return null;
};

/**
 * 获取项目的metadata文件
 * 
 * @param {string=} basePath 目录路径
 * @return {Object} 
 */
exports.getMetadataFile = function ( projectDir ) {
    if ( projectDir ) {
        return path.resolve( projectDir, PROJECT_CONF_DIR, METADATA_FILE );
    }

    return null;
};

/**
 * 创建项目的metadata文件
 * 
 * @param {string=} basePath 目录路径
 */
exports.createMetadataFile = function ( projectDir ) {
    var util = require( './util' );
    var confDir = path.resolve( projectDir, PROJECT_CONF_DIR );

    var mdFile = path.join( confDir, METADATA_FILE );
    if ( !fs.existsSync( mdFile ) ) {
        var metadata = util.clone( DEFAULT_METADATA );
        metadata.loaderUrl = require( './config' ).get( 'loader.url' );
        util.writeJson( mdFile, metadata );
    }
};

/**
 * 获取项目webserver配置文件
 * 
 * @param {string} projectDir 项目目录
 * @return {string} 
 */
exports.getWebserverConfFile = function ( projectDir ) {
    return path.resolve( 
        projectDir, 
        require( './webserver' ).getConfFileName()
    );
};

/**
 * 创建webserver配置文件
 * 
 * @param {string=} basePath 目录路径
 */
exports.createWebserverConfFile = function ( basePath ) {
    var projectDir = exports.findDir( basePath );
    if ( !projectDir ) {
        throw new Error( 'Not in project directory!' );
    }

    var confFile = exports.getWebserverConfFile( projectDir );
    var tplFile = path.resolve( __dirname, './project/webserver-conf.tpl' );

    if ( !fs.existsSync( confFile ) ) {
        var buf = fs.readFileSync( tplFile );
        fs.writeFileSync( confFile, buf );
    }
};

/**
 * 获取项目build配置文件
 * 
 * @param {string} projectDir 项目目录
 * @return {string} 
 */
exports.getBuildConfFile = function ( projectDir ) {
    return path.resolve( 
        projectDir, 
        require( './build' ).getConfFileName()
    );
};

/**
 * 创建build配置文件
 * 
 * @param {string=} basePath 目录路径
 */
exports.createBuildConfFile = function ( basePath ) {
    var projectDir = exports.findDir( basePath );
    if ( !projectDir ) {
        throw new Error( 'Not in project directory!' );
    }

    var confFile = exports.getBuildConfFile( projectDir );
    var tplFile = path.resolve( __dirname, './project/build-conf.tpl' );

    if ( !fs.existsSync( confFile ) ) {
        var buf = fs.readFileSync( tplFile );
        fs.writeFileSync( confFile, buf );
    }
};

/**
 * 项目module配置文件名称
 * 
 * @const
 * @inner
 * @type {string}
 */
var MODULE_CONF = 'module.conf';

/**
 * 获取项目module配置文件
 * 
 * @param {string=} basePath 目录路径
 * @return {string} 
 */
exports.getModuleConfFile = function ( basePath ) {
    var projectDir = exports.findDir( basePath );
    return path.resolve( projectDir, MODULE_CONF );
};

/**
 * 获取项目module配置
 * 
 * @param {string=} basePath 目录路径
 * @return {Objecg} 
 */
exports.getModuleConf = function ( basePath ) {
    var file = exports.getModuleConfFile( basePath );

    if ( fs.existsSync( file ) ) {
        return JSON.parse( fs.readFileSync( file, 'UTF-8' ) );
    }

    return null;
};

/**
 * 创建或者更新module配置文件
 * 
 * @param {string=} basePath 目录路径
 */
exports.updateModuleConfFile = function ( basePath ) {
    var projectDir = exports.findDir( basePath );
    if ( !projectDir ) {
        return;
    }

    var confFile = exports.getModuleConfFile( basePath );
    var metadata = exports.getMetadata( basePath );
    var conf = exports.getModuleConf( basePath ) || {};
    var util = require( './util' );

    conf.baseUrl = metadata.srcDir;
    conf.paths = conf.paths || {};
    conf.packages = [];

    // TODO: package的多版本并存处理
    var packages = require( './pm/import' ).getImportedPackages( basePath );
    for ( var key in packages ) {
        var pkg = packages[ key ];
        var ver = Object.keys( pkg ).sort( require( 'semver' ).rcompare )[ 0 ];
        var pkgDir = 'dep/' + key + '/' + ver;
        var pkgInfo = util.readJson(
            path.resolve( projectDir, pkgDir, 'package.json' )
        );

        // package包含src目录时，以src作为package源码目录
        // 否则，直接以package根目录作为源码目录
        // 开源社区的包很多都不包含src目录
        var srcLocation = pkgDir;
        if ( fs.existsSync( path.resolve( projectDir, pkgDir, 'src' ) ) ) {
            srcLocation += '/src';
        }

        var modInfo = {
            name: key,
            location: srcLocation
        };

        if ( pkgInfo.main ) {
            var main = pkgInfo.main;
            if ( main.indexOf( './src/' ) === 0 ) {
                main = main.substr( 6 );
            }
            if ( main ) {
                modInfo.main = main;
            }
        }
        conf.packages.push(modInfo);
    }

    util.writeJson( confFile, conf );
};

/**
 * 将目录初始化为项目目录
 * 
 * @param {string=} basePath 目录路径
 */
exports.init = function ( basePath ) {
    basePath = basePath || process.cwd();

    var projectDir = exports.findDir( basePath );
    if ( projectDir ) {
        throw new Error( 'Project is inited in ' + projectDir );
    }

    var infoDir = path.resolve( basePath, PROJECT_CONF_DIR );
    fs.mkdirSync( infoDir );

    exports.createMetadataFile( basePath );
    exports.createWebserverConfFile( basePath );
    exports.createBuildConfFile( basePath );
    exports.updateModuleConfFile( basePath );
};

/**
 * 创建项目目录
 * 
 * @param {string} dir 项目目录名称
 * @param {string=} basePath 目录路径
 */
exports.createDir = function ( dir, basePath ) {
    var projectDir = exports.findDir( basePath );
    var dirPath = path.resolve( projectDir, dir );

    require( 'mkdirp' ).sync( dirPath );
};

/**
 * 初始化项目目录结构
 * 
 * @param {string=} basePath 目录路径
 */
exports.initDir = function ( basePath ) {
    var createDir = exports.createDir;

    createDir( 'dep', basePath );
    createDir( 'src', basePath );
    createDir( 'tool', basePath );
    createDir( 'test', basePath );
    createDir( 'doc', basePath );
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
cli.command = 'project';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '项目管理相关功能。';

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
