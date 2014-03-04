/**
 * @file 项目更新loader配置
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
cli.command = 'updateLoaderConfig';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '更新项目的loader配置';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp project updateLoaderConfig';

/**
 * 模块命令行运行入口
 */
cli.main = function () {
    var project = require( 'edp-project' );
    var projectInfo = project.getInfo( process.cwd() );

    if ( projectInfo ) {
        project.loader.updateAllFilesConfig( projectInfo );
    }
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
