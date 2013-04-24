/**
 * @file 项目管理模块
 * @author errorrik[errorrik@gmail.com]
 * @module lib/project
 */

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

    var fs = require( 'fs' );
    var path = require( 'path' );
    
    while ( basePath ) {
        if ( fs.existsSync( basePath )
             && fs.statSync( basePath ).isDirectory()
        ) {
            var infoDir = basePath + '/' + PROJECT_CONF_DIR;
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
    var path = require( 'path' );
    var confDir = path.resolve( projectDir, PROJECT_CONF_DIR );

    return path.resolve( confDir, conf );
};

/**
 * 项目manifest配置文件名
 * 
 * @const
 * @inner
 * @type {string}
 */
var MANIFEST_FILE = './manifest';

/**
 * 项目默认manifest配置
 * 
 * @const
 * @inner
 * @type {Object}
 */
var DEFAULT_MANIFEST = {
    wwwroot: '/',
    loaderAutoConfig: 'js,htm,html,tpl'
};

/**
 * 获取项目的manifest信息
 * 
 * @param {string=} basePath 目录路径
 * @return {Object} 
 */
exports.getManifest = function ( basePath ) {
    var projectDir = exports.findDir( basePath );

    if ( projectDir ) {
        return JSON.parse( 
            require( 'fs' ).readFileSync( 
                exports.getConfFile( projectDir, MANIFEST_FILE ), 
                'UTF-8' 
            )
        );
    }

    return {};
};

exports.createManifest = function ( projectDir ) {
    var fs = require( 'fs' );
    var path = require( 'path' );
    var util = require( './util' );
    
    var file = path.resolve( projectDir, PROJECT_CONF_DIR, MANIFEST_FILE );

    if ( !fs.existsSync( file ) ) {
        var manifest = util.clone( DEFAULT_MANIFEST );
        manifest.loader = require( './config' ).get( 'loader' );
        fs.writeFileSync( 
            file, 
            util.stringifyJson( manifest ),
            'UTF-8' 
        );
    }
};

/**
 * 项目webserver配置文件名称
 * 
 * @const
 * @inner
 * @type {string}
 */
var WEBSERVER_CONF = 'webserver-conf.js';

/**
 * 获取项目webserver配置文件
 * 
 * @param {string} projectDir 项目目录
 * @return {string} 
 */
exports.getWebserverConfFile = function ( projectDir ) {
    return exports.getConfFile( projectDir, WEBSERVER_CONF );
};

/**
 * 创建webserver配置文件
 * 
 * @param {string=} basePath 目录路径
 */
exports.createWebserverConf = function ( basePath ) {
    var projectDir = exports.findDir( basePath );
    var confFile = exports.getWebserverConfFile( projectDir );

    var fs = require( 'fs' );
    var path = require( 'path' );
    var tplFile = path.resolve( __dirname, './project/webserver-conf.tpl' );

    if ( !fs.existsSync( confFile ) ) {
        var buf = fs.readFileSync( tplFile );
        fs.writeFileSync( confFile, buf );
    }
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

    var fs = require( 'fs' );
    var path = require( 'path' );

    var infoDir = path.resolve( basePath, PROJECT_CONF_DIR );
    fs.mkdirSync( infoDir );

    exports.createManifest( basePath );
    exports.createWebserverConf( basePath );
};

/**
 * 创建项目目录
 * 
 * @param {string} dir 项目目录名称
 * @param {string=} basePath 目录路径
 */
exports.createDir = function ( dir, basePath ) {
    var projectDir = exports.findDir( basePath );
    var dirPath = require( 'path' ).resolve( projectDir, dir );

    require( 'mkdirp' ).sync( dirPath );
};

/**
 * 初始化项目目录结构
 * 
 * @param {string=} basePath 目录路径
 */
exports.initDir = function ( basePath ) {
    var createDir = exports.createDir;

    createDir( 'lib', basePath );
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
