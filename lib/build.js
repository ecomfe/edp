/**
 * @file 构建功能的命令行执行
 * @author errorrik[errorrik@gmail.com]
 */


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
cli.command = 'build';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '构建目录或项目';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp build [--output=outputDir]';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [
    'output:',
    'exclude:'
];

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 * @param {Object} opts 命令运行选项
 */
cli.main = function ( args, opts ) {
    var baseDir = args[ 0 ] || process.cwd();
    var output = opts.output;
    var exclude = [];
    var path = require( 'path' );

    // 如果位于项目目录，以项目为单位构建
    var project = require( './project' );
    var projectDir = project.findDir( baseDir );
    if ( projectDir ) {
        var projectMetadata = project.getMetadata( baseDir );
        output = path.resolve( projectDir, projectMetadata.outputDir );
        exclude = projectMetadata.exclude || exclude;
    }

    // 默认输出目录为: 输入目录 + `-output`
    if ( !output ) {
        output = path.resolve( 
            baseDir, 
            '..', 
            path.basename( baseDir ) + '-output'
        );
    }

    // 如果输出目录存在，直接抛出异常
    // 防止项目构建输出影响和覆盖原有文件
    var fs = require( 'fs' );
    if ( fs.existsSync( output ) ) {
        throw new Error( output + ' directory is exist!' );
    }
    fs.mkdirSync( output );
    
    // 解析exclude参数
    if ( opts.exclude ) {
        exclude = opts.exclude
            .replace( /(^\s+|\s+$)/g, '' )
            .split( /\s*,\s*/ );
    }

    // 如果output目录处于baseDir下，自动将output目录添加到exclude
    var outputRelative = path.relative( baseDir, output );
    if ( !/^\.\./.test( outputRelative ) ) {
        exclude.push( outputRelative );
    }

    var processorOptions = [
        {
            name: 'path-mapper',
            entryReplacements: [
                { tag: 'link', attribute: 'href' },
                { tag: 'img', attribute: 'src' },
                { tag: 'script', attribute: 'src' }
            ],
            entryExtnames: 'html,htm,phtml,tpl,vm',
            from: 'src/',
            to: 'asset/'
        },
        {
            name: 'js-compressor'
        },
        {
            name: 'less-compiler'
        }
    ];
    require( './builder/main' )( baseDir, output, exclude, processorOptions );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
