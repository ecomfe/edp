/***************************************************************************
 * 
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * lib/upload.js ~ 2013/05/11 19:14:35
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
cli.command = 'upload';

/**
 * @const
 * @type {Array.<string>}
 */
cli.options = ['bucket:', 'name:'];

/**
 * @const
 * @type {string}
 */
cli.usage = 'edp upload <file> [--bucket=bucket]';

/**
 * @const
 * @type {string}
 */
cli.description = '支持通过bcs和icms来上传静态文件';

/**
 * @param {Array.<string>} args 命令行参数.
 * @param {Object.<string, string>} opts 命令的可选参数.
 */
cli.main = function(args, opts) {
    var file = args[0];
    if (!file) {
        console.error(cli.usage);
        process.exit(0);
    }

    var fs = require('fs');
    if (!fs.existsSync(file)) {
        console.error('No such file or directory = [' + file + ']');
        process.exit(0);
    }

    var config = require('./config');
    var ak = config.get('upload.bcs.ak');
    var sk = config.get('upload.bcs.sk');
    var host = config.get('upload.bcs.host');
    if (!ak || !sk) {
        console.error('Please set `upload.bcs.ak` and `upload.bcs.sk` first.');
        console.error('You can apply them from http://bcs-console.bae.baidu.com/');
        process.exit(0);
    }

    var bucket = opts.bucket || config.get('upload.bcs.bucket');
    if (!bucket) {
        console.error('Please specifiy the `bucket` you want to upload.');
        process.exit(0);
    }

    var objectName = null;
    if (opts.name) {
        objectName = '/' + opts.name.replace(/^\/+/g, '');
    }

    var bcs = require('./upload/bcs');
    var sdk = new bcs.BaiduCloudStorage(ak, sk, host);
    sdk.upload(bucket, file, objectName);
};

exports.cli = cli;



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
