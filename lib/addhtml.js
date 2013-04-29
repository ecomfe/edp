/**
 * @file 添加html文件的脚手架命令
 * @author errorrik[errorrik@gmail.com]
 */


/**
 * 默认html模板文件
 * 
 * @const
 * @ignore
 * @type {string}
 */
var TPL_FILE = './scaffold/html.tpl';

/**
 * 添加html文件
 * 
 * @param {string} file html文件
 * @param {Object=} tplData 模板数据
 * @param {string=} tplFile 模板文件
 */
function addhtml( file, tplData, tplFile ) {
    var path = require( 'path' );
    tplFile = tplFile || path.resolve( __dirname, TPL_FILE );
    file = path.resolve( process.cwd(), file );
    
    var data = {
        title: '[Please input title]',
        body: '[Page Body]'
    };

    // 读取loader信息
    var loaderData = require( './project/loader' ).getData( file );

    // 构建loader数据
    var util = require( './util' );
    if ( loaderData.url ) {
        var packages = loaderData.packages;
        packages.length > 0 && (packages[ packages.length - 1 ].last = true);
        util.extend( data, {
            loader: true,
            loaderConfig: true,
            loaderUrl: loaderData.url,
            loaderBaseUrl: loaderData.baseUrl,
            loaderPaths: loaderData.paths,
            loaderPackages: packages
        } );
    }
    
    // merge模板并写入文件
    util.extend( data, tplData );
    var tpl = util.compileHandlebars( tplFile );
    require( 'fs' ).writeFileSync( file, tpl( data ), 'UTF-8' );
}

module.exports = exports = addhtml;

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
cli.command = 'addhtml';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '添加html文件';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp addhtml <htmlfile>';

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 */
cli.main = function ( args ) {
    var htmlFile = args[ 0 ];
    if ( !htmlFile ) {
        console.log( '请输入html文件名' );
        return;
    }

    addhtml( htmlFile );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
