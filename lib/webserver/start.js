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
    var currentPath = process.cwd();
    var project = require( '../project' );
    var projectDir = project.findDir( currentPath );
    var confFile = project.getWebserverConfFile( projectDir );

    var fs = require( 'fs' );
    if ( projectDir && fs.existsSync( confFile ) ) {
        return require( confFile );
    }

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
          + ' [--proxy=PROXY_CONFIG_FILE] [DOCROOT]';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [
    'proxy:',
    'port:'
];

/**
 * 模块命令行运行入口
 */
cli.main = function ( args, opts ) {
    var rootDir = args[ 0 ];
    var proxy = opts.proxy;
    var port = opts.port;
    var path = require( 'path' );
    var fs = require( 'fs' );

    var proxyMap;
    if (proxy) {
        var proxyFile = path.resolve(process.cwd(), proxy);
        if (fs.existsSync(proxyFile)) {
            var content = fs.readFileSync(proxyFile, 'utf8');
            proxyMap = JSON.parse(content);
        }
    }

    var conf = loadConf();

    if ( !conf ) {
        console.log( 'Cannot load server config.' );
        return;
    }

    if ( conf.injectRes ) {
        conf.injectRes( require( './res' ) );
    }

    if (rootDir) {
        conf.documentRoot = path.resolve(process.cwd(), rootDir);
    }

    if (port) {
        conf.port = port;
    }

    if (proxyMap) {
        conf.proxyMap = proxyMap;
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
