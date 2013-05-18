/**
 * @file 美化JS、CSS和JSON文件命令
 * @author virola[virola.zhu@gmail.com]
 */

var fs = require('fs');

// TODO: when formatting js with comments, no blank line generated before 
//       comments, but escodegen doesn't support that at the moment.  

/**
 * 格式化文件
 * 
 * @param {string} file 文件名
 */
function beautify(file) {
    var extName = file.match(/\.(\w+)$/);

    if (extName) {
        extName = extName[1];
    }

    if (!fs.existsSync(file)) {
        console.error('未找到文件: [' + file + ']');
        return;
    }

    var data = fs.readFileSync(file, 'utf-8');

    var output;

    try {
        switch(extName) {
            case 'json':
                output = JSON.stringify(JSON.parse(data), null, 4);
                break;
            case 'js':
                output = beautifyJs(data);
                break;
            case 'css':
                output = beautifyCss(data);
                break;
            default:
                console.log('暂不支持该类型文件的格式化');
                return;
        }
    }
    catch ( err ) {
        console.log('文件解析错误: [' + file + ']');
        console.error( err );
        return;
    }

    // output
    console.log(output);
}

/**
 * 格式化JS代码
 * 
 * @param {string} sourceCode 要格式化的JS代码
 * 
 * @return {string} 格式化后的JS代码
 */
function beautifyJs(sourceCode) {
    var ast = require('esprima').parse(sourceCode, {
        range: true,
        comment: true,
        tokens: true
    });


    var escodegen = require('escodegen');
    escodegen.attachComments(ast, ast.comments, ast.tokens);

    return escodegen.generate(ast, {
        comment: true,
        format: {
            indent: {
                style: '    '
            },
            escapeless: true
        } 
    });

}


/**
 * 格式化CSS代码
 * 
 * @param {string} sourceCode 要格式化的CSS代码
 * @return {string} 格式化后的CSS代码
 */
function beautifyCss(sourceCode) {
    var cssBeautify = require('cssbeautify');

    return cssBeautify(sourceCode, {
        indent: '  ',
        autosemicolon: true
    });
}

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
cli.command = 'beautify';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '格式化JS、CSS和JSON文件';


/**
 * @const
 * @type {string}
 */
cli.usage = 'edp beautify <filename>';

/**
 * @param {Array.<string>} args 命令行参数.
 */
cli.main = function(args) {
    var filename = args[0];

    if (!filename) {
        console.log('请输入要格式化的文件名');
        return;
    }

    beautify(filename);
};

exports.cli = cli;
