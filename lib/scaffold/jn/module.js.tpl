/***************************************************************************
 *
 * Copyright (c) {{{app_create_year}}} Baidu.com, Inc. All Rights Reserved
 * $Id: module.js 108952 2012-02-20 07:26:43Z  $
 *
 **************************************************************************/



/**
 * src/{{{app_package_path}}}/module.js ~ {{{app_create_time}}}
 * @author {{{app_user_email}}} ({{{app_user_name}}})
 * @version $Revision: 108952 $
 * @description
 * {{{app_module}}}这个模块
 **/

goog.require('er.controller');
goog.require('jn.util');

goog.provide('{{{app_module}}}.Fields');
goog.provide('{{{app_module}}}.config');
goog.provide('{{{app_module}}}.data');

/**
 * @const
 * @type {Object.<string, *>}
 */
{{{app_module}}}.Fields = {
    // CODE HERE.
};

/**
 * @type {Object}
 * @const
 */
{{{app_module}}}.config = {
    'action' : [
        // CODE HERE.
    ],

    'url' : {
        // CODE HERE.
    }
};

/**
 * 后端数据访问接口
 * @type {Object.<string, function(string, Function, Function)>}.
 */
{{{app_module}}}.data = jn.util.da_generator([
    // CODE HERE
]);

er.controller.addModule({{{app_module}}});





















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
