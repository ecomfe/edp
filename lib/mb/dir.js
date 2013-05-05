/**
 * @file dir builder 文件夹Build
 * @author cxl[c.xinle@gmail.com]
 */

var path = require('path');
var fs = require('fs');
var util = require('./util');
var moduleBuilder = require('./module');

// 命令行参数及其默认值
var OPTIONS = {
        'module-config': 'module.conf',
        'output': 'output'
    };

// 不需要扫描入口模块的文件夹
// 只会排除目标文件夹下的第一级子目录
// 实际使用时会是全路径形式 并且外加output目录
var EXCLUDE_FOLDER = ['lib'];

// 需要扫描入口模块的文件后缀
var INCLUDE_FILES = 'js,htm,html,tpl,vm,phtml';

/**
 * 文件夹是否是需要排除
 *
 * @param {string} dir 文件夹名
 * @return {boolean}
 */
function isExcludeDir(dir) {
    var res = false;

    EXCLUDE_FOLDER.forEach(function (item) {
        res = res || (item == dir);
    });
    return res;
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
 * 解析moduleId数组
 */
function parseModuleId(str) {
    var state = 0; // 0 - 寻找状态 1 - 读取状态
    var res = [];
    var token;
    var word;

    function readQuote(c) {
        if (!state) {
            state = 1;
            word = c;
        }
        else if (word.charAt(0) == c) {
            res.push(word.substring(1));
            state = 0;
        }
        else {
            throw new Error('Parse Module Id Error, Unexpected Char: ' + c);
        }
    }

    var i = 0;
    var len = str.length;
    while (i < len) {
        token = str.charAt(i);

        if (token == '\'' || token == '"') {
            readQuote(token);
        }
        else if (state == 1) {
            // 没有做字符检查
            word += token;
        }
        i++;
    }

    if (state) {
        throw new Error('Parse Module Id Error, Missing Quote');
    }

    return res;
}

/**
 * 过滤JS注释
 *
 * @param {string} code
 * @return {string}
 */
function filterComment(code) {
    var state = 0; //0 - 寻找状态 1 - 收集状态
    var i = 0;
    var len = code.length;
    var token;
    var comments = [];

    function wantStartComment() {
        var c = code.charAt(i + 1);
        if (c == '/' || c == '*') {
            state = 1;
            comments.push({
                type: c,
                start: i
            });
            i++;
        }
    }

    function wantEndComment(token) {
        var item = comments[comments.length - 1];

        if (item) {
            if (item.type == '/' && token == '\n') {
                item.end = i;
                state = 0;
            }
            else if (token == '/' && item.type == '*' && code.charAt(i - 1) == '*') {
                item.end = i;
                state = 0;
            }
        }
    }

    while (i < len) {
        token = code.charAt(i);
        if (token == '/') {
            state ? wantEndComment(token) : wantStartComment(token);
        }
        else if (token == '\n') {
            wantEndComment(token);
        }
        i++;
    }

    var start = 0;
    var res = [];
    comments.forEach(function (item) {
        res.push(code.substring(start, item.start));
        start = item.end + 1;
    });
    if (start < code.length) {
        res.push(code.substring(start));
    }

    return res.join('');
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

    // 不使用esprima 改用简单状态机
    // 对于大文件速度能提升不少
    code = filterComment(code);
    var index = code.search(/([^!]?\s*require\s*\(\s*\[([^\]]+)\])/);
    while(index >= 0) {
        res = res.concat(parseModuleId(RegExp.$2));
        code = code.substring(index + RegExp.$1.length);
        index = code.search(/[^!]?\s*require\s*\(\s*\[([^\]]+)\]/);
    }

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
        else if (stat.isDirectory() && !isExcludeDir(fullPath)) {
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
        var stat = fs.statSync(file);
        if (stat.isDirectory()) {
            modules = modules.concat(scanModule(file, moduleConfigFile));
            return;
        }
        else if (!stat.isFile()) {
            return;
        }

        if (path.extname(file) != '.js') {
            return;
        }

        var code = fs.readFileSync(file, 'utf-8');
        // 不使用esprima分析了
        // 改成去掉注释后正则匹配开头字符的形式
        code = filterComment(code);
        if (/^(\r|\n|\s)*define\s*\(/.test(code)) {
            var moduleId = util.getModuleId(
                    path.relative(path.dirname(moduleConfigFile), file),
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
    // 处理不需要进行入口模块扫描的文件夹路径
    // 全路径形式
    EXCLUDE_FOLDER.forEach(function (dir, index) {
        EXCLUDE_FOLDER[index] = path.resolve(params.args[0], dir);
    });
    EXCLUDE_FOLDER.push(path.resolve(options.output));

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
            files[file] = 1;
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
