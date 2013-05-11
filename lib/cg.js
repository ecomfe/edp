/***************************************************************************
 *
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * lib/cg.js ~ 2013/05/11 13:54:52
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 * EDP Code Generation Module
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
cli.command = 'cg';

/**
 * @const
 * @type {Array.<string>}
 */
cli.options = ['name:', 'super_class:', 'action_path:'];

/**
 * @const
 * @type {string}
 */
cli.usage = 'edp cg <name> [--super_class=The super ' +
            'class was inherited] [--action_path=The action path]';

/**
 * 模块命令行运行入口
 *
 * @param {Array.<string>} args.
 * @param {Object.<string, string>=} opts
 */
cli.main = function(args, opts) {
    var path = require('path');
    var fs = require('fs');
    var config = require('./config');

    if (!config.get('cg.template')) {
        console.error('Please run `edp config cg.template <template>` first.');
        process.exit(0);
    }

    var templateDir = path.resolve(__dirname, 'scaffold',
        config.get('cg.template'));
    if (!fs.existsSync(templateDir)) {
        console.error('No such directory = [' + templateDir + ']');
        process.exit(0);
    }

    var name = args[0];
    if (!name) {
        console.log(cli.usage);
        process.exit(0);
    }

    // $1 => package
    // $3 => actionName
    var namePattern = /^(([a-z\d_]+\.)+)([A-Z]\w+)$/;
    var match = name.match(namePattern);
    if (!match) {
        console.error('`name` should match this pattern: ' +
            namePattern.toString());
        process.exit(0);
    }

    var package = match[1];
    var actionName = match[3];
    var appCfg = getAppConfig(package, actionName, templateDir, opts);
    console.log(appCfg);
    runMain(appCfg);
};

function generateCode(templateName, dstPath, appCfg) {
    var path = require('path');
    var fs = require('fs');

    var templateFile = path.join(appCfg['app_template_dir'],
        templateName + '.tpl');
    if (!fs.existsSync(templateFile)) {
        console.error('No such template file = [' + templateFile + ']');
        return;
    }

    var util = require('./util');
    var tpl = util.compileHandlebars(templateFile);
    fs.writeFileSync(dstPath, tpl(appCfg), 'UTF-8');

    console.log('+ %s', dstPath);
}

function generateModule(modulePath, appCfg) {
    var fs = require('fs');
    var path = require('path');

    if (!fs.existsSync(modulePath)) {
        require('mkdirp').sync(modulePath);
    }

['module.js', 'module.less', 'mockup.js'].forEach(function(item){
        var dstPath = path.join(modulePath, item);
        if (!fs.existsSync(dstPath)) {
            generateCode(item, dstPath, appCfg);
        }
    });
}

function generateAction(modulePath, appCfg) {
    var path = require('path');
    var actionName = appCfg['app_action_name'];

    ['action.js', 'action.html',
     'action.less', 'action.app.html'].forEach(function(item){
        var dstPath = path.join(modulePath,
            item.replace(/^action/, actionName));
        generateCode(item, dstPath, appCfg);
    });
}

/**
 * @param {Object} appCfg 配置信息.
 */
function runMain(appCfg) {
    var dstModulePath = appCfg['mod_dst_path'];
    generateModule(dstModulePath, appCfg);
    generateAction(dstModulePath, appCfg);
}

/**
 * @param {string} package
 * @param {string} actionName
 * @param {string} templateDir
 * @param {Object.<string, string>=} opts
 * @return {Object}
 */
function getAppConfig(package, actionName, templateDir, opts) {
    var path = require('path');

    // ShowCase -> show_case
    var lowercaseActionName = actionName.replace(/\B[A-Z]/g, function($1){
        return '_' + $1.toLowerCase();
    }).toLowerCase();

    // jn.this_is_a_module.ShowCaseDemo -> jn-this_is_a_module-show-case-demo
    var className = package.replace(/\./g, '-') +
        lowercaseActionName.replace(/_/g, '-');

    // jn.this_is_a_module.ShowCaseDemo -> jn_this_is_a_module_show_case_demo
    var viewName = package.replace(/\./g, '_') + lowercaseActionName;

    // jn.this_is_a_module.ShowCaseDemo -> src/jn/this_is_a_module
    var dstModulePath = path.join.apply(null,
        ['src'].concat(package.split('.')));
    var dstPathPrefix = path.join(dstModulePath,
        lowercaseActionName).replace(/\\/g, '/');
    var actionPath = opts['action_path'] || dstPathPrefix.substr(3);
    var superClass = opts['super_class'] || 'er.Action';
    var relativePath = path.relative(path.resolve(dstModulePath),
        path.resolve('src')).replace(/\\/g, '/');

    var config = require('./config');
    var appUserName = config.get('user.name');
    var appUserEmail = config.get('user.email');

    package = package.replace(/\.$/, '');
    return {
        'app_name': package + '.' + actionName,
        'app_module': package,
        'app_package_path': package.replace(/\./g, '/'),
        'app_super_class': superClass,
        'app_relative_path': relativePath,
        'app_action_path': actionPath,
        'app_action_name': lowercaseActionName,
        'app_class_name': className,
        'app_view_name': viewName,
        'app_template_dir': templateDir,

        'app_user_name': appUserName,
        'app_user_email': appUserEmail,

        'app_create_year': new Date().getFullYear(),
        'app_create_time': new Date().toString(),

        'mod_class_name': package.replace(/\./g, '-'),
        'mod_dst_path': dstModulePath
    };
}

exports.cli = cli;

















/* vim: set ts=4 sw=4 sts=4 tw=100: */
