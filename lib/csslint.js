/**
 * @file CSS检测模块
 * @author Firede[firede@firede.us]
 */

var fs = require( 'fs' );
var path = require( 'path' );
var util = require( './util' );
var colors = require( 'colors' );

// 目前 csslint 项目正在考虑配置文件格式改 json 的问题：
// https://github.com/stubbornella/csslint/issues/359
// 
// 考虑到可读性，用扁平化的 JSON 格式配置，不支持 csslint 官方的 CLI Arguments 式配置。
// 
// 示例：
//  {
//      "box-model": false,
//      "import": false,
//      "outline-none": false,
//      "duplicate-background-images": false
//  }

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

    // 读取当前目录下的'.csslintrc'配置文件
    var csslintRcFile = path.resolve( dir, '.csslintrc' );
    if ( fs.existsSync( csslintRcFile ) ) {
        var rcText = fs.readFileSync( csslintRcFile, 'UTF-8' );
        try {
            var conf = JSON.parse( rcText );
        }
        catch (e) {
            console.error( '`.csslintrc` syntax error, see `edp help csslint`.' );
            process.exit( 1 );
        }
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
            && path.extname( file ).toLowerCase() == '.css'
        ) {
            detectCSS( filename, startDir, conf, result );
        }
    }
}

/**
 * 检测CSS文件
 * 
 * @inner
 * @param {string} file 文件路径
 * @param {string=} startDir 开始目录路径
 * @param {Object=} conf 验证配置
 * @param {Array} result 结果保存数组
 */
function detectCSS( file, startDir, conf, result ) {
    conf = conf || require( './csslint/conf' );

    var data = {};
    result.push( data );
    data.file = path.relative( startDir, file );

    var csslint = require( 'csslint' ).CSSLint;
    var source = fs.readFileSync( file, 'UTF-8' );
    
    var defaultConf = csslint.getRuleset();
    conf = util.extend( defaultConf, conf );

    if ( source.trim() === '' ) {
        data.success = {
            messages: [
                {
                    type: 'error',
                    message: 'File is empty.'
                }
            ]
        };
    } else {
        data.success = csslint.verify( source, conf );
    }
}

/**
 * 显示检测结果报告
 * 
 * @inner
 * @param {Array.<Object>} result 检测结果数组
 */
function report( result ) {
    var fileCount = result.length;
    var errorCount = 0;
    var warningCount = 0;
    var failFileCount = 0;

    console.log( util.colorize( 'CSS Lint Result', 'title' ) );
    console.log( util.colorize( '======', 'info' ) );

    result.forEach( function( item ) {
        if (item.success) {
            var messages = item.success.messages || [];
            if ( messages.length > 0 ) {
                failFileCount++;

                outputTitle( item.file );
                messages.forEach(function( message ) {
                    ( message.type === 'warning' ) && warningCount++;
                    ( message.type === 'error' ) && errorCount++;

                    outputMessage( message );
                });
            }
        }
    });

    outputTitle( 'Total' );
    console.log(
        'Detect ' + fileCount + ' files.',
        'find ' + errorCount + ' errors',
        'and ' + warningCount + ' warnings',
        'in ' + failFileCount + ' files.\n'
    );
}

/**
 * 输出单条检测信息
 * 
 * @inner
 * @param {Object} message 检测信息对象
 */
function outputMessage( message ) {
    var position = '';
    var failInfo = message.type.toUpperCase();

    // 全局性的错误可能没有位置信息
    if ( message.line && message.col ) {
        position = util.colorize(
            '[L' + message.line + ',C' + message.col + '] ',
            'info'
        );
    }

    // 如果有符合的规则，加入失败信息中
    if ( message.rule && message.rule.name ) {
        failInfo += ': ' + message.rule.name;
    }

    console.log( position + util.colorize( failInfo, message.type ) );
    console.log( 'Message:', message.message );
    if ( message.evidence ) {
        if ( message.evidence.length > 160 ) {
            console.log(
                'Evidence:',
                util.colorize( 'Compressed CSS, ignore evidence.', 'info' )
            );
        } else {
            console.log( 'Evidence:', message.evidence );
        }
    }
    console.log();
}

function outputTitle( title ) {
    console.log();
    console.log( util.colorize( title, 'title' ) );
    console.log( util.colorize( '------\n', 'info' ) );
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
cli.command = 'csslint';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '使用csslint检测当前目录下所有CSS文件。';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp csslint [target] [--no-color]';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [ 'no-color' ];

/**
 * 模块命令行运行入口
 *
 * @param {Array.<string>} args
 * @param {Object} opts
 */
cli.main = function ( args, opts ) {
    if ( opts[ 'no-color' ] ) {
        colors.mode = 'none';
    }

    var result = [];

    var target = args[ 0 ];
    if (target) {
        var fs = require( 'fs' );
        if ( !fs.existsSync( target ) ) {
            console.error( 'No such file or directory = [' + target + ']' );
            process.exit( 1 );
        } else {
            var fsStat = fs.statSync( target );
            if ( fsStat.isDirectory() ) {
                readDir( target, null, null, result );
            } else {
                detectCSS(
                    target,
                    require( 'path' ).dirname( target ),
                    null,
                    result
                );
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
exports.cli = cli;
