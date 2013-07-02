/**
 * @file 添加html文件命令
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
    htmlFile = require( 'path' ).resolve( process.cwd(), htmlFile );

    var data = {
        title: '[Please input title]',
        body: '[Page Body]'
    };


    // 读取loader信息, 构建loader数据
    var loaderData = require( 'edp-project' ).loader.getConfig( htmlFile );
    if ( loaderData && loaderData.url ) {
        var packages = loaderData.packages;
        packages.length > 0 && (packages[ packages.length - 1 ].last = true);

        data.loader = true;
        data.loaderConfig = true;
        data.loaderUrl = loaderData.url;
        data.loaderBaseUrl = loaderData.baseUrl;
        data.loaderPaths = loaderData.paths;
        data.loaderPackages = packages;
    }
    
    require( 'edp-codegen' ).html( data, htmlFile );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
