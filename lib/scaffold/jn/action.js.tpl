/***************************************************************************
 *
 * Copyright (c) {{{app_create_year}}} Baidu.com, Inc. All Rights Reserved
 * $Id: action.js 150523 2012-10-30 10:06:05Z  $
 *
 **************************************************************************/



/**
 * src/{{{app_package_path}}}/{{{app_action_name}}}.js ~ {{{app_create_time}}}
 * @author {{{app_user_email}}} ({{{app_user_name}}})
 * @version $Revision: 150523 $
 * @description
 * {{{app_action_name}}}相关的实现逻辑
 **/

goog.require('{{{app_super_class}}}');
goog.require('{{{app_module}}}.config');
goog.require('{{{app_module}}}.data');

goog.include('{{{app_package_path}}}/module.less');
goog.include('{{{app_package_path}}}/{{{app_action_name}}}.less');
goog.include('{{{app_package_path}}}/{{{app_action_name}}}.html');

goog.provide('{{{app_name}}}');

/**
 * @constructor
 * @extends {{{app_super_class}}}
 * @export
 */
{{{app_name}}} = function() {
    {{{app_super_class}}}.call(this);

    /**
     * 当前Action的View模板名称.
     * @type {string}
     */
    this.view = 'MAIN_PAGE_{{{app_view_name}}}';
};
baidu.inherits({{{app_name}}}, {{{app_super_class}}});

/** @inheritDoc */
{{{app_name}}}.prototype.initModel = function(argMap, callback) {
    // CODE HERE.

    callback();
};

/** @inheritDoc */
{{{app_name}}}.prototype.afterInit = function(page) {
    // CODE HERE.
};





















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
