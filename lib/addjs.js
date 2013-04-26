/**
 * @file 添加javascript文件的脚手架命令
 * @author errorrik[errorrik@gmail.com]
 * @module lib/addjs
 */


/**
 * 默认javascript模板文件
 * 
 * @const
 * @ignore
 * @type {string}
 */
var TPL_FILE = './scaffold/js.tpl';

/**
 * 添加js文件
 * 
 * @param {string} file html文件
 * @param {Object=} tplData 模板数据
 * @param {string=} tplFile 模板文件
 */
function addjs( file, tplData, tplFile ) {
    var util = require( './util' );
    var path = require( 'path' );
    tplFile = tplFile || path.resolve( __dirname, TPL_FILE );
    
    var tpl = util.compileHandlebars( tplFile );
    var data = {
        moduleId: 'exports',
        author: '[Please input author]',
        file: '[Please input file description]',
        moduleDescription: '[Please input module description]',
        objectModule: 1
    };
    util.extend( data, require( './project' ).getMetadata(), tplData );
    require( 'fs' ).writeFileSync( file, tpl( data ), 'UTF-8' );
}

module.exports = exports = addjs;

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
cli.command = 'addjs';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = ['id:', 'type:'];

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '添加javascript文件';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp addjs <jsfile> [--id=yourid] [--type=function|object]';

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 * @param {Array} args 命令运行选项
 */
cli.main = function ( args, opts ) {
    var jsFile = args[ 0 ];
    if ( !jsFile ) {
        console.log( '请输入javascript文件名' );
        return;
    }

    var data = {};
    if ( opts.id ) {
        data.moduleId = opts.id;
    }

    switch ( opts.type ) {
        case 'function':
            data.functionModule = true;
            break;
        case 'object':
            data.objectModule = true;
            break;
    }

    addjs( jsFile, data );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
