/**
 * @file 监视器功能的命令行执行
 * @author firede[firede@firede.us]
 */

var path = require( 'path' );
var fs = require( 'fs' );

/**
 * 命令行选项
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
cli.command = 'watch';

/**
 * 命令描述信息
 * 
 * @type {string}
 */
cli.description = '监视文件以执行预定任务';

/**
 * 命令用法信息
 * 
 * @type {string}
 */
cli.usage = 'edp watch [--config=confFile] [taskGroupId]';

/**
 * 命令选项信息
 * 
 * @type {Array}
 */
cli.options = [
    'config:'
];

/**
 * 默认监视器配置文件
 * 
 * @inner
 * @const
 * @type {string}
 */
var DEFAULT_WATCH_CONF = 'edp-watch-config.js';

/**
 * 获取配置文件名
 * 
 * @return {string}
 */
exports.getConfFileName = function() {
    return DEFAULT_WATCH_CONF;
}

/**
 * 加载配置文件
 * 
 * @inner
 * @param {string=} confFile 配置文件路径
 * @return {Object|null}
 */
function loadConf( confFile ) {
    var cwd = process.cwd();

    if ( confFile ) {
        confFile = path.resolve( cwd, confFile );
        if ( fs.existsSync( confFile ) ) {
            return require( confFile );
        }

        return null;
    }

    var dir;
    var parentDir = cwd;
    do {
        dir = parentDir;
        confFile = path.resolve( dir, DEFAULT_WATCH_CONF );
        if ( fs.existsSync( confFile ) ) {
            return require( confFile );
        }

        parentDir = path.resolve( dir, '..' );
    } while ( parentDir != dir );

    return null;
}

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令行运行参数
 * @param {Object} opts 命令行选项
 */
cli.main = function( args, opts ) {
    var conf = loadConf( opts.config );
    var taskGroupId = args[0];

    if ( !conf ) {
        console.error( 'Watch config is required, see `edp help watch`.' );
        process.exit( 0 );
    }

    require( 'edp-watch' )( conf, taskGroupId );
};

/**
 * 命令行配置项
 * 
 * @type {Object}
 */
exports.cli = cli;
