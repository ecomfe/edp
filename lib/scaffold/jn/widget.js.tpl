/***************************************************************************
 *
 * Copyright (c) %(app.create.year)s Baidu.com, Inc. All Rights Reserved
 * $Id: widget.js 150523 2012-10-30 10:06:05Z  $
 *
 **************************************************************************/



/**
 * src/{{{app_package_path}}}/{{{app_action_name}}}.js ~ %(app.create.time)s
 * @author %(app.user.email)s (%(app.user.name)s)
 * @version $Revision: 150523 $
 * @description
 * {{{app_action_name}}}相关的实现逻辑
 **/

goog.require('%(app.super_class)s');

goog.include('{{{app_package_path}}}/{{{app_action_name}}}.less');
goog.include('{{{app_package_path}}}/{{{app_action_name}}}.html');

goog.provide('%(app.name)s');

/**
 * @constructor
 * @param {Object} data 数据集合.
 * @extends {%(app.super_class)s}
 * @export
 */
%(app.name)s = function(data) {
    %(app.super_class)s.call(this, data);

    /**
     * 当前Widget的View模板名称.
     * @type {string}
     */
    this._view = 'AD_%(app.view_name)s';
};
baidu.inherits(%(app.name)s, %(app.super_class)s);

/** @override */
%(app.name)s.prototype.enterDocument = function() {
    %(app.name)s.superClass.enterDocument.call(this);

    // CODE HERE
};

/** @override */
%(app.name)s.prototype.bindEvent = function() {
    %(app.name)s.superClass.bindEvent.call(this);

    // CODE HERE
};

/** @override */
%(app.name)s.prototype.patchData = function() {
    if (this._data) {
        this._data['_custom_data'] = new Date();
    }
}






















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
