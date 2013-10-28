/**
 * @file minify
 * @author Leo Wang(leowang721@gmail.com)
 */

var path = require('path');
var fs = require('fs');

/**
 * 文件信息
 *
 * @inner
 * @constructor
 *
 * @param {string} options 文件信息
 *
 */
function File(options) {
    this.filename = options.filename;
    this.extname = options.extname;
    this.path = options.path;
    
    var data = options.data;
    if(data) {
        this.processData(data);
    }    
}


/**
 * 读取文件信息，需要指定this.path
 * 
 * @inner
 */
File.prototype.read = function() {
    var path = this.path;
    if(!path || !fs.existsSync(path)) {
        console.log('指定的输入文件不存在');
        return false;
    }
    var data = fs.readFileSync(path);
    this.processData(data);
};


/**
 * 处理数据【读取的或者传入的】
 * 
 * @inner
 * @param {string} 指定数据，不传则读取this.data
 */
File.prototype.processData = function(data) {
    var data = data || this.data;
    this.data = 
        /\x00/.test(
            data.toString('ascii', 0, Math.min(data.length, 4096))
        )
        ? data
        : data.toString('UTF-8');
};

/**
 * 向文件写入数据，当前数据
 * 
 * @inner
 * @param {string} data 指定数据，不传则读取this.data
 */
File.prototype.write = function(data) {
    var data = data || this.data;
    fs.writeFileSync(this.path, data, 'UTF-8');
};

/**
 * 向文件写入minify之后的数据
 * 
 * @inner
 * @param {string} data 指定数据，不传则读取this.data
 * @param {string} path 指定路径，不传则读取this.path
 */
File.prototype.writeMinify = function(data, path) {
    var data = data || this.data;
    var path = path || this.path;
    
    if(!fs.existsSync(path)) {
        console.log('指定的输出文件不存在');
        return;
    }

    fs.writeFileSync(this.path, this.getMinifyData(data), 'UTF-8');
};

/**
 * 获取最小化数据
 * 
 * @inner
 * @param {string} data 指定数据，不传则读取this.data
 */
File.prototype.getMinifyData = function(data) {
    var data = data || this.data;

    var compressedData;
    var processor;
    var extraParam;
    switch(this.extname) {
    case 'js':
        processor = require('./util').compressJavascript;
        compressedData = processor(data);
        break;
    case 'css':
        processor = require('uglifycss').processString;
        extraParam = {
            maxLineLen: 0,
            expandVars: false,
            cuteComments: true
        };
        compressedData = processor(this.data, extraParam);
        break;
    case 'json':
        compressedData = JSON.parse(JSON.stringify(data));
        break;
    default:
        console.log('不支持的文件类型：' + this.extname
            + '，文件未被压缩。');
        compressedData = this.data;
        break;
    }

    return compressedData;
};

/**
 * 命令行配置项
 * 
 * @inner
 * @type {Object}
 */
var cli = {};

/**
 * 命令名称
 * 
 * @type {string}
 */
cli.command = 'minify';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '使用minify命令来让js、css、json文件获得最小化的输出。';


/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [
    'output:',
    'engine:'
];

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp minify source.js [-o target.js]';

/**
 * 模块命令行运行入口
 *
 * @param {Array.<string>} args
 * @param {Object} opts 命令运行选项
 */
cli.main = function(args, opts) {
    var source = args[0];

    if(!source) {
        console.log('错误的输入文件信息！');
        return;
    }
    
    var spath = path.resolve('.', source);
    var sfileextPlus = path.extname(source); // 有.，例如：.js
    var sfileext = sfileextPlus.slice(1); // 去除那个. 例如：js
    var sfilename = path.basename(source).replace(sfileextPlus, '');
    

    if(!sfileext) {
        console.log('未能获取文件扩展名信息，默认使用js类型。');
        sfileext = 'js';
        // fix spath
        spath += '.js';
    }
    
    var sfile = new File({
        filename: sfilename,
        extname: sfileext,
        path: spath
    });
    
    // 读取文件内容失败，不继续处理
    if(sfile.read() === false) {
        return;
    }
    
    
    // 处理输出

    // 如果没有指定输出文件，则使用同名，即 filename.compiled.extname
    var textname = sfile.extname;
    var tfilename = '';
    var tpath;

    // 读取-o参数，可以没有，会进行默认处理
    if(!opts.o) {
        tfilename = sfile.filename + '.compiled';
        tpath = path.resolve('.', tfilename + '.' + textname);
        console.log('未能获取到指定的输出文件，系统自动指定为：' + tpath);
    }
    else {
        tfilename = opts.o.replace(sfileextPlus, '');
        tpath = path.resolve('.', opts.o);
    }
    var targetFile = new File({
        filename: tfilename,
        extname: textname,
        path: tpath
    });
    targetFile.data = sfile.getMinifyData();
    targetFile.write();
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
