/**
 * @file Javascript检测模块
 * @author errorrik[errorrik@gmail.com]
 * @module lib/jshint
 */

/**
 * 命令名称
 *
 * @type {string}
 */
exports.command = 'jshint';

/**
 * 模块描述信息
 *
 * @type {string}
 */
exports.description = 'Detect javascript source use jshint.';

/**
 * 模块初始化
 *
 * @param {Object} context 运行环境
 */
exports.init = function ( context ) {
    context.commander
        .command( exports.command )
        .description( exports.description )
        .action( context.processor.packMain( exports.main ) );
};

/**
 * 模块运行入口
 *
 * @param {Array} commands 运行命令
 * @param {Object} args 运行参数
 */
exports.main = function ( commands, args ) {
    var result = [];
    readDir( process.cwd(), null, null, result );

    report( result );
};

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

    // 读取当前目录下的'.jshintrc'配置文件
    var jshintRcFile = dir + '/.jshintrc';
    if ( fs.existsSync( jshintRcFile ) ) {
        var rcBuffer = fs.readFileSync( jshintRcFile );
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
            && path.extname( file ).toLowerCase() == '.js'
        ) {
            detectJS( filename, startDir, conf, result );
        }
    }
}

/**
 * 检测Javascript文件
 * 
 * @inner
 * @param {string} file 文件路径
 * @param {string=} startDir 开始目录路径
 * @param {Object=} conf 验证配置
 * @param {Array} result 结果保存数组
 */
function detectJS( file, startDir, conf, result ) {
    conf = conf || require( './jshint/conf' );

    var data = {};
    result.push( data );
    data.file = path.relative( startDir, file );

    var jshint = require( 'jshint' ).JSHINT;
    var source = fs.readFileSync( file );

    data.success = jshint( source.toString( 'UTF-8' ), conf );
    if ( !data.success ) {
        data.errors = jshint.errors;
        data.data = jshint.data();
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
                    err.character + ': ' + err.reason );
            } );
            console.log( '\n' );
        }
    } );

    consoleTitle( 'Total' );
    console.log( 'Detect ' + count + ' files, find ' 
        + errorCount + ' errors in ' + errorFileCount + ' files.\n' );
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


