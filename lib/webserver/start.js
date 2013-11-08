/**
 * @file 开发时web调试服务器启动入口
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com],
 *         ostream[ostream.song@gmail.com],
 *         firede[firede@firede.us]
 */


/**
 * 默认配置文件名
 * 
 * @const
 * @type {string}
 */
var DEFAULT_CONF_FILE = 'edp-webserver-config.js';

/**
 * 加载配置文件
 * 
 * @inner
 * @param {string=} confFile 配置文件路径
 * @return {Object}
 */
function loadConf( confFile ) {
    var fs = require( 'fs' );
    var path = require( 'path' );
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
        confFile = path.resolve( dir, DEFAULT_CONF_FILE );
        if ( fs.existsSync( confFile ) ) {
            return require( confFile );
        }

        parentDir = path.resolve( dir, '..' );
    } while ( parentDir != dir );

    return require( 'edp-webserver' ).getDefaultConfig();
}

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
cli.command = 'start';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '启动EDP WebServer';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [
    'proxy:',
    'port:',
    'config:',
    'document-root:'
];

/**
 * 模块命令行运行入口
 */
cli.main = function ( args, opts ) {
    var proxy = opts.proxy;
    var port = opts.port;
    var docRoot = opts[ 'document-root' ];
    var conf = opts.config;

    var path = require( 'path' );
    var fs = require( 'fs' );
    conf = loadConf( conf );

    if ( !conf ) {
        console.log( 'Cannot load server config.' );
        return;
    }

    if ( docRoot ) {
        conf.documentRoot = path.resolve( process.cwd(), docRoot );
    }

    if ( port ) {
        conf.port = port;
    }

    if ( proxy ) {
        var proxyFile = path.resolve( process.cwd(), proxy );
        if ( fs.existsSync( proxyFile ) ) {
            var content = fs.readFileSync( proxyFile, 'utf8' );
            conf.proxyMap = JSON.parse( content );
        }
    }
    
    var server = require( 'edp-webserver' );
    server.start( conf );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
