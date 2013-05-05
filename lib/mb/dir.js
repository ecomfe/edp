/**
 * @file dir builder 文件夹Build
 * @author cxl[c.xinle@gmail.com]
 */

var path = require('path');
var fs = require('fs');
var util = require('./util');
var moduleBuilder = require('./module');
var esprima = require('./esprima-1.0.2');
var estraverse = require('./estraverse-1.1.1');

var SYNTAX = estraverse.Syntax;
var SYNTAX_REQUIRE = 'require';
var SYNTAX_DEFINE = 'define';

// 命令行参数及其默认值
var OPTIONS = {
        'module-config': 'module.conf',
        'output': 'output'
    };

// 不需要扫描的文件夹
var EXCLUDE_FOLDER = 'lib';

// 需要扫描的文件后缀
var INCLUDE_FILES = 'js,htm,html,tpl,vm,phtml';

/**
 * 文件夹是否是需要排除
 *
 * @param {string} dir 文件夹名
 * @return {boolean}
 */
function isExcludeDir(dir) {
    return EXCLUDE_FOLDER.indexOf(dir) >= 0;
}

/**
 * 扩展对象
 *
 * @param {Object} target 目标对象
 * @param {Object} source 源对象
 * @return {Object} 目标对象
 */
function extend(target, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
    return target;
}

/**
 * 获取html中的JS代码
 *
 * @param {string} code HTML代码
 * @return {string} JS代码
 */
function getScripts(code) {
    var res = [];

    var items = code.split(/<\/?script[^>]*>/);
    for (var i = 1; i < items.length; i += 2) {
        if (items[i]) {
            res.push(items[i]);
        }
    }

    return res.join('\n');
}

/**
 * 扫描文件 获取需要合并的moduleId
 *
 * @param {string} file 文件路径
 * @return {Array.<string>} moduleId数组
 */
function scanFile(file) {
    var res = [];
    var extname = path.extname(file).substring(1);
    if (INCLUDE_FILES.indexOf(extname) < 0) {
        return res;
    }

    var code = fs.readFileSync(file, 'utf-8');
    if (extname != 'js') {
        code = getScripts(code);
    }
   
    var content = esprima.parse(code);

    estraverse.traverse(content, {
        enter: function (element) {
            // 找到global require
            if (element.type == SYNTAX.CallExpression
                && element.callee.name == SYNTAX_REQUIRE
                && element.arguments[0].type == SYNTAX.ArrayExpression
            ) {
                element.arguments[0].elements.forEach(function(item) {
                    res.push(item.value);
                });
            }
        }
    });

    return res;
}

/**
 * 数组indexOf
 */
function indexOf(item, arr) {
    var i = -1;
    arr.forEach(function (name, index) {
        if (item === name) {
            i = index;
        }
    });

    return i;
}

/**
 * 扫描文件夹 找到需要合并的moduleId
 *
 * @param {string} dir 文件夹路径
 * @return {Array.<string>} moduleId数组
 */
function scanEntry(dir) {
    var items = fs.readdirSync(dir);
    var res = [];

    function addModule(items) {
        items.forEach(function (item) {
            if (indexOf(item, res) < 0) {
                res.push(item);
            }
        });
    }

    items.forEach(function (file) {
        if (file.charAt(0) == '.') {
            return;
        }

        var fullPath = path.resolve(dir, file);
        var stat = fs.statSync(fullPath);
        if (stat.isFile()) {
            addModule(scanFile(fullPath));
        }
        else if (stat.isDirectory() && !isExcludeDir(file)) {
            addModule(scanEntry(fullPath));
        }
    });

    return res;
}

/**
 * 搜索文件夹，找到所有的moduleId
 *
 * @param {string} dir 路径
 * @param {string} moduleConfigFile
 * @return {Array.<string>} moduleIds
 */
function scanModule(dir, moduleConfigFile) {
    var stat = fs.statSync(dir);
    var files = [];
    if (stat.isFile()) {
        files.push(dir);
    }
    else {
        files = fs.readdirSync(dir);
        files.forEach(function (file, index) {
            files[index] = path.join(dir, file);
        });
    }

    var modules = [];
    files.forEach(function (file) {
        var fullPath = file;
        var stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            modules = modules.concat(scanModule(fullPath, moduleConfigFile));
            return;
        }
        else if (!stat.isFile()) {
            return;
        }

        if (path.extname(file) != '.js') {
            return;
        }

        file = fs.readFileSync(fullPath, 'utf-8');

        var code = esprima.parse(file);
        var element = code.body[0];

        if (element.type == SYNTAX.ExpressionStatement
                && element.expression.type == SYNTAX.CallExpression
                && element.expression.callee.name == SYNTAX_DEFINE
        ) {
            var moduleId = util.getModuleId(
                    path.relative(path.dirname(moduleConfigFile), fullPath),
                    moduleConfigFile
                );

            if (moduleId) {
                modules.push(moduleId);
            }
        }
    });

    return modules;
}

// TODO packages处理
if (util.isRunFromCli(__filename)) {
    // 获取命令行参数
    var keys = [];
    for (var key in OPTIONS) {
        if (OPTIONS.hasOwnProperty(key)) {
            keys.push(key + (typeof OPTIONS[key] == 'string' ? ':' : ''));
        }
    }
    var params = util.parseCliArgv(keys);
    var options = params.options;

    // 填充默认值
    for (var key in OPTIONS) {
        if (OPTIONS.hasOwnProperty(key) && !options.hasOwnProperty(key)) {
            options[key] = OPTIONS[key];
        }
    }

    if (params.args.length <= 0) {
        throw new Error('Please input dir');
    }

    if (fs.existsSync(options.output)) {
        util.rmdirForce(options.output);
    }
    fs.mkdir(options.output);

    // single build
    // 按照baseUrl, paths, packages路径进行单文件build
    var moduleConfigFile = options['module-config'];
    var moduleConfig = util.readModuleConfig(moduleConfigFile);
    var modules = scanModule(moduleConfig.baseUrl, moduleConfigFile);
    for (var key in moduleConfig.paths) {
        if (moduleConfig.paths.hasOwnProperty(key)) {
            var dir = moduleConfig.paths[key];
            if (util.isRelativePath(dir)) {
                dir = path.join(moduleConfig.baseUrl, dir);
                if (!fs.existsSync(dir)) {
                    dir += '.js';
                }
                modules = modules.concat(scanModule(dir, moduleConfigFile));
            }
        }
    }
    moduleConfig.packages.forEach(function (item) {
        var dir = item.location;
        if (util.isRelativePath(dir)) {
            dir = path.join(moduleConfig.baseUrl, dir);
            modules = modules.concat(scanModule(dir, moduleConfigFile));
        }
    });
    var files = {};
    var buildOptions = extend({mode: 'single'}, options);
    modules.forEach(function (item) {
        var file = util.getModuleFile(item, moduleConfigFile);
        if (file && !files[file]) {
            buildOptions.output = path.join(options.output, '/', item + '.js');
            moduleBuilder.combine(item, buildOptions);
        }
    });

    // combine build
    // 扫描目标文件夹，找到所有入口module，进行combine合并
    var modules = scanEntry(params.args[0]);
    modules.forEach(function (item) {
        var data = extend({mode: 'combine'}, options);

        var output = util.getModuleFile(item, options['module-config']);
        output = output.replace(
                path.join(moduleConfig.baseUrl, '/'), 
                path.join(options.output, '/')
            );
        data.output = output;
        moduleBuilder.combine(item, data);
    });
}
