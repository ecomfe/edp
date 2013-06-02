/**
 * @file 开发时web调试服务器启动入口
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com],
 *         ostream[ostream.song@gmail.com]
 */



/**
 * 加载配置文件
 * 
 * @inner
 * @return {Object}
 */
function loadConf() {
    var fs = require( 'fs' );
    var path = require( 'path' );
    var ws = require( '../webserver' );

    var dir = process.cwd();
    var parentDir = dir;
    do {
        dir = parentDir;
        var confFile = path.resolve( dir, ws.getConfFileName() );
        if ( fs.existsSync( confFile ) ) {
            return require( confFile );
        }

        parentDir = path.resolve( dir, '..' );
    } while ( parentDir != dir );

    return require( './conf' );
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
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp webserver start [--port=PORT]'
          + ' [--proxy=PROXY_CONFIG_FILE]'
          + ' [--documentRoot=DOCUMENT_ROOT]';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [
    'proxy:',
    'port:',
    'documentRoot:'
];

/**
 * 模块命令行运行入口
 */
cli.main = function ( args, opts ) {
    var proxy = opts.proxy;
    var port = opts.port;
    var docRoot = opts.documentRoot;

    var path = require( 'path' );
    var fs = require( 'fs' );
    var conf = loadConf();

    if ( !conf ) {
        console.log( 'Cannot load server config.' );
        return;
    }

    if ( conf.injectRes ) {
        conf.injectRes( require( './res' ) );
    }

    if ( docRoot ) {
        conf.documentRoot = path.resolve( process.cwd(), docRoot );
    }

    if ( port ) {
        conf.port = port;
    }

    if ( proxy ) {
        var proxyFile = path.resolve(process.cwd(), proxy);
        if ( fs.existsSync( proxyFile ) ) {
            var content = fs.readFileSync(proxyFile, 'utf8');
            conf.proxyMap = JSON.parse(content);
        }
    }

    var server = require( '../webserver' );
    server.start( conf );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
