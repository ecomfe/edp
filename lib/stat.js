/***************************************************************************
 *
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * lib/stat.js ~ 2013/05/11 22:31:42
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 * 统计命令edp的命令使用历史，方便后续的优化.
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
cli.command = 'stat';

/**
 * @const
 * @type {string}
 */
cli.usage = 'edp stat';

/**
 * 命令的入口函数.
 */
cli.main = function() {
    var fs = require('fs');
    var url = require('url');
    var http = require('http');

    var historyFile = require('./edp').getConfig('.edp_history');
    if (!fs.existsSync(historyFile)) {
        console.error('No such file = [' + historyFile + ']');
        process.exit(1);
    }

    var fsStat = fs.statSync(historyFile);
    if (fsStat.size <= 0) {
        process.exit(0);
    }

    var config = require('./config');
    var userName = config.get('user.name');

    var querystring = require('querystring');
    var data = querystring.stringify({
        'title': userName,
        'file_name': 'edp_history.log',
        'code': fs.readFileSync(historyFile).toString('utf-8')
    });

    var options = url.parse('http://git.jumbo.ws/api/v3/projects/57/snippets' +
        '?private_token=idYr9aKArA2RpExMFMV8');
    options['method'] = 'POST';
    options['headers'] = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
    };

    console.log('Uploading to http://git.jumbo.ws/fe/lego-widgets/snippets');
    var req = http.request(options, function(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('Successfully upload, Thanks :-)');
            fs.unlinkSync(historyFile);
        } else {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                console.error(chunk);
            });
        }
    });
    req.on('error', function(e) {
        console.error('Problem with request: ' + e.message);
    });
    req.write(data);
    req.end();
};

exports.cli = cli;





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
