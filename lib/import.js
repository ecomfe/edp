/**
 * @file 项目导入依赖包模块的命令行执行
 * @author errorrik[errorrik@gmail.com]
 */


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
cli.command = 'import';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '导入包';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [ 'older', 'save-dev' ];

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp import <package> [--older] [--save-dev]';

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 */
cli.main = function ( args, opts ) {
    var name = args[ 0 ];
    if ( !name ) {
        console.error( cli.usage );
        process.exit( 0 );
    }

    var path = require( 'path' );
    var pkg = require( 'edp-package' );
    var fs = require( 'fs' );
    var file = path.resolve( process.cwd(), name );
    if ( 
        /\.(gz|tgz|zip)$/.test( name ) 
        && fs.existsSync( file ) 
    ) {
        pkg.importFromFile( file );
    }
    else if (path.basename( file ) == 'package.json') {
        var options = {
                older: opts[ 'older' ],
                saveDev: opts[ 'save-dev' ]
            };
        pkg.importFromPackage( file , options );
    }
    else {
        pkg.importFromRegistry( name );
    }
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
