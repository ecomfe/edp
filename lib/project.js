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
var PROJECT_DIR = '.edp';


/**
 * 将目录初始化为项目目录
 * 
 * @param {string} basePath 目录路径
 */
exports.init = function ( basePath ) {
    basePath = basePath || process.cwd();

    var projectDir = exports.findDir( basePath );
    if ( projectDir ) {
        throw new Error( 'Project is inited in ' + projectDir );
    }

    var infoDir = require( 'path' ).resolve( basePath, PROJECT_DIR );
    require( 'fs' ).mkdirSync( infoDir );
};

/**
 * 获取项目所在目录路径
 * 
 * @param {string} basePath 目录路径
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
            var infoDir = basePath + '/' + PROJECT_DIR;
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
    return projectDir + '/' + PROJECT_DIR + '/' + conf;
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
