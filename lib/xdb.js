/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * lib/xdb.js ~ 2014/02/08 11:29:00
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 **/

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
cli.command = 'xdb';

/**
 * @const
 * @type {Array.<string>}
 */
cli.options = [];

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '没用的，请忽略';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp xdb';

/**
 * 模块命令行运行入口
 *
 * @param {Array.<string>} args
 * @param {Object} opts
 */
cli.main = function ( args, opts ) {
    var project = require( 'edp-project' );
    var projectInfo = project.getInfo( process.cwd() );
    if ( projectInfo ) {
        project.module.updateConfig( projectInfo );
        project.loader.updateAllFilesConfig( projectInfo );
        project.style.updatePackageImport( projectInfo );
    }
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
