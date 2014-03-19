/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * lib/add.js ~ 2014/02/08 11:29:00
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * edp add js a.js
 * edp add html a.html
 * edp add action a.action
 * ...
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
cli.command = 'add';

/**
 * @const
 * @type {Array.<string>}
 */
cli.options = ['id:', 'type:', 'force:'];

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '自动生成一些脚手架文件。';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp add';

/**
 * 模块命令行运行入口
 *
 * @param {Array.<string>} args
 * @param {Object} opts
 */
cli.main = function ( args, opts ) {
    require('./util').require(
        'edp-add',
        function ( error, cmd ) {
            !error && cmd.start(args, opts);
        }
    );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
