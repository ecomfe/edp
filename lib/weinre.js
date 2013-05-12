/***************************************************************************
 *
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * lib/weinre.js ~ 2013/05/12 21:58:00
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 *
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
cli.command = 'weinre';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = 'WEb INspector REmote';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp weinre';

/**
 * 模块命令行运行入口
 */
cli.main = function() {
    var path = require('path');

    var rootPath = path.resolve(__dirname, '..', 'node_modules', 'weinre');

    var lib = path.join(rootPath, 'lib');
    var nodeModules = path.join(rootPath, 'node_modules');

    // FIXME(leeight) Dirty Hack.
    process.argv = [];

    require(path.join(nodeModules, 'coffee-script'));
    require(path.join(lib, '/cli')).run();
};

exports.cli = cli;



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
