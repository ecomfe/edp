/**
 * @file 添加html文件的脚手架命令
 * @author errorrik[errorrik@gmail.com]
 * @module lib/addhtml
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
    var util = require( './util' );
    var path = require( 'path' );
    tplFile = tplFile || path.resolve( __dirname, TPL_FILE );
    
    var tpl = util.compileHandlebars( tplFile );
    var data = {
        title: '[Please input title]',
        body: '[Page Body]'
    };
    util.extend( data, require( './project' ).getManifest(), tplData );
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
cli.description = 'addhtml';

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
