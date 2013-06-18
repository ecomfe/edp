/**
 * @file 包查询功能
 * @author errorrik[errorrik@gmail.com] 
 *         fanxueliang[fanxueliang.g@gmail.com]
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
cli.command = 'search';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '查询现有的包';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp pm search [keyword]';

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 */
cli.main = function ( args ) {
    var keyword = args[ 0 ] || '';

    require( './pm/search' )( keyword, function ( error, data ) {
        /*data.forEach( function ( pkg ) {
            console.log( pkg.name );
            console.log( '----------' );
            console.log( '\n描述: ' + pkg.description );
            console.log( '\n修改时间: ' + (pkg.time || 'unknown') );
            console.log( '\n作者:\n ');
            pkg.maintainers.forEach( function ( author ) {
                console.log( '+ ' + author.name + '[' + author.email + ']' );
            } );
            console.log( '\n版本:\n ');
            pkg.versions.forEach( function ( version ) {
                console.log( '+ ' + version );
            } );
            console.log( '\n' );
        } );*/
    } );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
