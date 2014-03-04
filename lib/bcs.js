/***************************************************************************
 *
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * lib/bcs.js ~ 2013/05/11 19:14:35
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 静态资源上传的功能
 **/

/**
 * 命令行配置项
 *
 * @inner
 * @type {Object}
 */
var cli = {};

/**
 * @const
 * @type {string}
 */
cli.command = 'bcs';

/**
 * @const
 * @type {Array.<string>}
 */
cli.options = ['max-size:', 'auto-uri'];

/**
 * @const
 * @type {string}
 */
cli.description = '支持通过bcs来上传静态文件';

/**
 * @param {Array.<string>} args 命令行参数.
 * @param {Object.<string, string>} opts 命令的可选参数.
 */
cli.main = function(args, opts) {
    require('./util').require(
        'edp-bcs',
        function ( error, cmd ) {
            !error && cmd.start(args, opts);
        }
    );
};

exports.cli = cli;



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
