/**
 * @file module builder 模块Build
 * @author cxl[c.xinle@gmail.com]
 */

var util = require('./util');
var esprima = require('./esprima-1.0.2');
var escodegen = require('./escodegen-0.0.22');
var estraverse = require('./estraverse-1.1.1');
var fs = require('fs');

// 关键词
var SYNTAX = estraverse.Syntax;
var SYNTAX_DEFINE = 'define';
var SYNTAX_REQUIRE = 'require';
var SYNTAX_EXPORTS = 'exports';
var SYNTAX_MODULE = 'module';

var MODE_SINGLE = 'single';
// var MODE_COMBINE = 'combine';

// 命令行参数及其默认值
var OPTIONS = {
        'module-config': 'module.conf',
        'mode': MODE_SINGLE,
        'output': 'output.js'
    };

function isArray(item) {
    return require('util').isArray(item);
}

/**
 * 解析AST节点
 *
 * @param {Object} root AST根节点.
 * @return {Object} 解析结果.
 */
function parseAST(root) {
    var res = {deps: []};
    estraverse.traverse(root, {
        enter: function(item) {
            if (item.type == SYNTAX.CallExpression) {
                var callee = item.callee.name;
                var args = item.arguments;
                if (callee == SYNTAX_REQUIRE) {
                    var value = args[0].value;
                    // 插件加载不进行合并
                    if (value && value.indexOf('!') < 0) {
                        // 将require的模块保存到依赖中
                        res.deps.push(value);
                    }
                }
                else if (callee == SYNTAX_DEFINE) {
                    // 虽然参数有明确的先后顺序，但是每个参数类型都不同
                    // 所以在解析的时候就忽略参数的位置了 靠类型的区分
                    args.forEach(function(o) {
                        // define的参数是string的话认为是moduleId
                        if (typeof o == 'string') {
                            res.moduleId = o;
                        }
                        else if (isArray(o)) {
                            res.deps = res.deps.concat(o);
                        }
                    });
                }
            }
        }
    });
    return res;
}

/**
 * 根据AST生成代码
 *
 * @param {Object} root AST根节点.
 * @param {Object} info 文件信息.
 *  @param {string} info.moduleId
 *  @param {Array.<string>} info.deps 文件依赖.
 */
function generateCode(root, info) {
    estraverse.replace(root, {
        enter: function(element) {
            if (element.type == SYNTAX.CallExpression
                && element.callee.name == SYNTAX_DEFINE
            ) {
                var args = [];
                args.push({
                    type: SYNTAX.Literal,
                    value: info.moduleId
                });
                var param = {
                    type: SYNTAX.ArrayExpression,
                    elements: []
                };
                args.push(param);

                var deps = [SYNTAX_REQUIRE, SYNTAX_EXPORTS,
                    SYNTAX_MODULE].concat(info.deps);
                for (var i = 0, item; !!(item = deps[i]); i++) {
                    param.elements.push({
                        type: SYNTAX.Literal,
                        value: item,
                        raw: i + 1
                    });
                }
                args.push(element.arguments[element.arguments.length - 1]);

                element.arguments = args;

                this.break();

                return element;
            }
        }
    });

    return escodegen.generate(root);
}

/**
 * 解析文件
 *
 * @param {string} moduleId
 * @param {string} code 文件源码.
 * @return {string} 解析后的结果.
 */
function parseFile(moduleId, code) {
    var content = esprima.parse(code);
    var res = parseAST(content);
    if (!res.moduleId) {
        res.moduleId = moduleId;
    }
    res.code = generateCode(content, res);
    return res;
}

/**
 * 根据相对路径得到moduleId
 *
 * @param {string} base 相对moduleId.
 * @param {string} item 相对路径.
 * @return {string} moduleId.
 */
function resolveModuleId(base, item) {
    var res = base.split('/');
    var items = item.split('/');

    res.splice(res.length - 1, 1);
    items.forEach(function(o) {
        if (o == '..') {
            res.splice(res.length - 1, 1);
        }
        else if (o != '.') {
            res.push(o);
        }
    });

    return res.join('/');
}

/**
 * 创建modelId的链接
 *
 * @param {string} source 创建的moduleId.
 * @param {string} target 目标moduleId.
 * @return {string} code.
 */
function createLink(source, target) {
    return 'define(\'' + source + '\', [\'' + target +
        '\'], function (main) { return main; });';
}

/**
 * 根据文件路径创建缺失的文件夹
 *
 * @param {string} file
 */
function mkdir4File(file) {
    var dir = require('path').dirname(file);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

/**
 * 合并JS文件
 *
 * @param {string} moduleId 起始的moduleId.
 * @param {Object} options 命令行参数.
 */
function combine(moduleId, options) {
    var needLoad = [];
    var loaded = [];
    var codes = [];
    var loadedFiles = {};

    function isExsitModule(item) {
        var res = false;
        var arr = [].concat(needLoad);
        arr = arr.concat(loaded);

        for (var i = 0, o; !!(o = arr[i]); i++) {
            if (item == o) {
                res = true;
                break;
            }
        }

        return res;
    }


    function addDeps(moduleId, deps) {
        deps.forEach(function(item) {
            if (item.charAt(0) == '.') {
                item = resolveModuleId(moduleId, item);
            }
            if (!isExsitModule(item)) {
                needLoad.push(item);
            }
        });
    }

    needLoad.push(moduleId);
    var res;
    var file;
    while (needLoad.length > 0) {
        moduleId = needLoad.shift();
        loaded.push(moduleId);
        file = util.getModuleFile(moduleId, options['module-config']);
        if (!file) {
            throw new Error('cant\'t not find ' + moduleId);
        }

        // 如果文件已经合并过，则只创建modelId链接
        if (loadedFiles[file]) {
            codes.push(createLink(moduleId, loadedFiles[file]));
            continue;
        }
        else {
            loadedFiles[file] = moduleId;
        }

        // 不通过file去匹配moduleId
        res = parseFile(moduleId, fs.readFileSync(file, 'utf-8'));

        if (options.mode != MODE_SINGLE) {
            addDeps(moduleId, res.deps);
        }
        codes.push(res.code);
    }

    codes.reverse();

    mkdir4File(options['output']);
    fs.writeFileSync(options['output'], codes.join('\n\n'), 'utf-8');
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
        throw new Error('Please input file');
    }

    combine(params.args[0], options);
}

exports.combine = combine;
