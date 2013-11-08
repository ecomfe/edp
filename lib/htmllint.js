/**
 * @file HTML检测模块
 * @author chris[wfsr@foxmail.com]
 */


var fs = require( 'fs' );
var path = require( 'path' );

/**
 * 读取目录
 * 
 * @inner
 * @param {string} dir 目录路径
 * @param {string=} startDir 开始目录路径
 * @param {Object=} conf 验证配置
 * @param {Array} result 结果保存数组
 */
function readDir( dir, startDir, conf, result ) {
    startDir = startDir || dir;
    var files = fs.readdirSync( dir );

    // 读取当前目录下的'.htmllintrc'配置文件
    var htmllintRcFile = dir + '/.htmllintrc';
    if ( fs.existsSync( htmllintRcFile ) ) {
        var rcBuffer = fs.readFileSync( htmllintRcFile );
        conf = JSON.parse( rcBuffer.toString( 'UTF-8' ) );
    }

    // 扫瞄文件与文件夹
    for ( var i = 0, len = files.length; i < len; i++ ) {
        var file = files[ i ];
        var filename = dir + '/' + file;

        // 忽略隐藏文件
        if ( /^\./.test( file ) ) {
            continue;
        }

        var fsStat = fs.statSync( filename );
        if ( fsStat.isDirectory() ) {
            readDir( filename, startDir, conf, result );
        }
        else if ( 
            fsStat.isFile() 
            && /\.html?$/i.test(path.extname( file ))
        ) {
            detectHTML( filename, startDir, conf, result );
        }
    }
}

/**
 * 检测HTML文件
 * 
 * @inner
 * @param {string} file 文件路径
 * @param {string=} startDir 开始目录路径
 * @param {Object=} conf 验证配置
 * @param {Array} result 结果保存数组
 */
function detectHTML( file, startDir, conf, result ) {
    conf = conf || require( './htmllint/conf' );

    var data = {};
    result.push( data );
    data.file = path.relative( startDir, file );

    var htmllint = require('./htmllint/htmllint');

    var source = fs.readFileSync( file );

    var errors = htmllint.lint( source.toString( 'UTF-8' ), conf );
    data.success = !errors.length;
    if ( !data.success ) {
        data.errors = errors;
    }
}


/**
 * 显示检测结果报告
 * 
 * @inner
 * @param {Array.<Object>} result 检测结果数组
 */
function report( result ) {
    var count = result.length;
    var errorFileCount = 0;
    var errorCount = 0;

    result.forEach( function ( data ) {
        if ( !data.success ) {
            errorFileCount++;
            errorCount += data.errors.length;
            consoleTitle( data.file );

            data.errors.forEach( function ( err, idx ) {
                if ( !err ) {
                    return;
                }

                console.log( (idx + 1) + '. line ' + err.line + ', col ' +
                    err.column + ': ' + err.warning );
            } );
            console.log( '\n' );
        }
    } );

    consoleTitle( 'Total' );
    console.log( 'Detected ' + count + ' file(s), found ' 
        + errorCount + ' error(s) in ' + errorFileCount + ' file(s).\n' );
    result.forEach( function ( data ) {
        if ( !data.success ) {
            console.log( '- ' + data.file );
        }
    } );
    console.log( '\n' );
}

/**
 * console.log标题
 * 
 * @inner
 * @param {string} title 标题描述
 */
function consoleTitle( title ) {
    console.log( title );
    console.log( '---------------\n' );
}

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
cli.command = 'htmllint';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '使用htmllint检测当前目录下所有HTML文件。';

/**
 * 模块命令行运行入口
 *
 * @param {Array.<string>} args
 */
cli.main = function (args) {
    var result = [];

    var target = args[0];
    if (target) {
        var fs = require('fs');
        if (!fs.existsSync(target)) {
            console.error('No such file or directory = [' + target + ']');
            process.exit(1);
        } else {
            var fsStat = fs.statSync(target);
            if (fsStat.isDirectory()) {
                readDir(target, null, null, result);
            } else {
                detectHTML(target, path.dirname(target), null, result);
            }
        }
    } else {
        readDir( process.cwd(), null, null, result );
    }
    report( result );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
// exports.cli = cli;