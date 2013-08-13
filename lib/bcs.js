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
cli.usage = 'edp bcs <file or dir> bs://<bucket> [--max-size=10m] [--auto-uri]';

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
    var file = args[0];
    if (!file || args.length != 2) {
        console.error(cli.usage);
        process.exit(0);
    }

    var maxSize = opts['max-size'];
    if (!maxSize) {
        maxSize = 10 * 1024 * 1024;   // 10M
    } else {
        var msptn = /^(\d+)([mk])?/i;
        var match = maxSize.match(msptn);
        if (!match) {
            console.error(cli.usage);
            process.exit(0);
        }

        maxSize = parseInt(match[1], 10);
        var unit = match[2];
        if (unit == 'm' || unit == 'M') {
            maxSize = maxSize * (1024 * 1024);
        } else if (unit == 'k' || unit == 'K') {
            maxSize = maxSize * (1024);
        }

        if (!maxSize) {
            maxSize = 10 * 1024 * 1024;
        }
    }

    var bktptn = /^bs:\/\/([^\/]+)(.*)?$/;
    var match = args[1].match(bktptn);
    if (!match) {
        console.error(cli.usage);
        process.exit(0);
    }

    var bucket = match[1];
    var target = (match[2] || '').replace(/^\/+/, '');

    var fs = require('fs');
    if (!fs.existsSync(file)) {
        console.error('No such file or directory = [' + file + ']');
        process.exit(0);
    }

    var config = require('edp-config');
    var ak = config.get('bcs.ak');
    var sk = config.get('bcs.sk');
    if (!ak || !sk) {
        console.error('Please set `bcs.ak` and `bcs.sk` first.');
        console.error('You can apply them from ' +
            'http://bcs-console.bae.baidu.com/');
        process.exit(0);
    }

    var autoUri = !!opts['auto-uri'];

    var bcs = require('./bcs/sdk');
    var sdk = new bcs.BaiduCloudStorage(ak, sk, maxSize, autoUri);
    sdk.upload(bucket, file, target);
};

exports.cli = cli;



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
