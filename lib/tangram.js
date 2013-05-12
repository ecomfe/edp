/***************************************************************************
 *
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * lib/tangram.js ~ 2013/05/12 21:16:33
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
 * @const
 * @type {string}
 */
cli.command = 'tangram';

/**
 * @const
 * @type {Array.<string>}
 */
cli.options = ['f:'];

/**
 * @const
 * @type {string}
 */
cli.usage = 'edp tangram [-f=baidu.g,baidu.on]';

/**
 * @const
 */
var API_ALIAS_MAP = {
    'baidu.format' : 'baidu.string.format',
    'baidu.setStyles' : 'baidu.dom.setStyles',
    'baidu.inherits' : 'baidu.lang.inherits',
    'baidu.show' : 'baidu.dom.show',
    'baidu.addClass' : 'baidu.dom.addClass',
    'baidu.removeClass' : 'baidu.dom.removeClass',
    'baidu.Q' : 'baidu.dom.q',
    'baidu.ie' : 'baidu.browser.ie',
    'baidu.hide' : 'baidu.dom.hide',
    'baidu.isString' : 'baidu.lang.isString',
    'baidu.G' : 'baidu.dom.g',
    'baidu.g' : 'baidu.dom.g',
    'baidu.insertHTML' : 'baidu.dom.insertHTML',
    'baidu.setStyle' : 'baidu.dom.setStyle',
    'baidu.getAttr' : 'baidu.dom.getAttr',
    'baidu.encodeHTML' : 'baidu.string.encodeHTML',
    'baidu.trim' : 'baidu.string.trim',
    'baidu.isObject' : 'baidu.lang.isObject',
    'baidu.setAttrs' : 'baidu.dom.setAttrs',
    'baidu.un' : 'baidu.event.un',
    'baidu.on' : 'baidu.event.on',
    'baidu.q' : 'baidu.dom.q',
    'baidu.getStyle' : 'baidu.dom.getStyle',
    'baidu.each' : 'baidu.array.each',
    'baidu.decodeHTML' : 'baidu.string.decodeHTML',
    'baidu.extend' : 'baidu.object.extend',
    'baidu.setAttr' : 'baidu.dom.setAttr',
    'baidu.dom.setOuterHeight' : 'baidu.dom.setBorderBoxHeight',
    'baidu.dom.setOuterWidth' : 'baidu.dom.setBorderBoxWidth'
};

/**
 * @param {Array.<string>} apis The tangram apis.
 */
function fetchRemoteCode(apis) {
    api = apis.map(function(api) {
        if (API_ALIAS_MAP[api]) {
            return '///import ' + API_ALIAS_MAP[api] + ';';
        }
        return '///import ' + api + ';';
    });

    var targetUrl = 'http://wbapi.baidu.com/service/tangram/merge';
    var options = {
        data: {
            'compress' : 'source',
            'src' : api.join('\n'),
            'version' : 'Tangram-component',
            'slavelib' : 'Tangram-base'
        }
    };

    var util = require('./util');
    util.httpPost(targetUrl, options, function(err, res, message) {
        if (err) {
            throw err;
        }
        console.log(message);
    });
}

/**
 * @param {Array.<string>} args 命令行参数.
 * @param {Object.<string, string>} opts 命令的可选参数.
 */
cli.main = function(args, opts) {
    if (!opts.f) {
        console.error(cli.usage);
        process.exit(0);
    }

    var apis = opts.f.split(',');
    fetchRemoteCode(apis);
};

exports.cli = cli;





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
