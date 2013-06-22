/**
 * @file 构建功能主模块
 * @author errorrik[errorrik@gmail.com],
 *         firede[firede@firede.us]
 */

var fs = require( 'fs' );
var util = require( '../util' );
var path = util.path;

/**
 * 检查内容是否二进制内容（否则为文本内容）
 * 
 * @param {Buffer} buffer buffer对象
 * @return {boolean}
 */
function isBinary( buffer ) {
    var hexString = buffer.toString( 
        'hex', 
        0, 
        Math.min( buffer.length, 4096 )
    );

    while ( 1 ) {
        var zzIndex = hexString.indexOf( '00' );
        if ( zzIndex < 0 ) {
            return false;
        }
        else if ( zzIndex % 2 === 0 ) {
            return true;
        }
        
        hexString = hexString.slice( zzIndex + 1 );
    }
}

/**
 * 文件信息类
 * 
 * @inner
 * @constructor
 * @param {Object} options 初始化选项
 * @param {Buffer|string} options.data 文件数据
 * @param {string} options.extname 文件扩展名
 * @param {string} options.path 文件路径，相对于构建目录
 * @param {string} options.fullPath 文件完整路径
 */
function FileInfo( options ) {
    var data = options.data;
    // 二进制文件data为buffer
    // 文本文件data为字符串
    // 脑残才用gbk
    // 该检测方法为王杨提供
    this.data = 
        isBinary( data )
        ? data
        : data.toString( 'UTF-8' );

    this.extname = options.extname;
    this.path = options.path;
    this.fullPath = options.fullPath;
    this.outputPath = this.path;

    // 保存一份raw data
    // 有的处理器可能直接针对或者获取源数据
    this.rawData = this.data.slice( 0 );

    this.dataTransfer = {};
}

/**
 * 设置文件数据
 * 
 * @param {Buffer|string} data 文件数据
 */
FileInfo.prototype.setData = function ( data ) {
    if ( !this.processFinished ) {
        this.data = data;
    }
};

/**
 * 获取属性数据信息。该数据信息用于processor存储文件处理状态
 * 
 * @param {string} name 属性名
 * @return {*}
 */
FileInfo.prototype.get = function ( name ) {
    return this.dataTransfer[ name ];
};

/**
 * 设置属性数据信息。该数据信息用于processor存储文件处理状态
 * 
 * @param {string} name 属性名
 * @param {*} value 属性值
 */
FileInfo.prototype.set = function ( name, value ) {
    this.dataTransfer[ name ] = value;
};

/**
 * 构建处理环境类
 * 
 * @inner
 * @constructor
 * @param {Object} options 初始化选项
 * @param {string} options.baseDir 构建基础目录
 * @param {Array.<string>} options.exclude 构建排除文件列表
 * @param {string} options.outputDir 构建输出目录
 */
function ProcessContext( options ) {
    this.files = {};
    this.baseDir = options.baseDir;
    this.exclude = options.exclude;
    this.outputDir = options.outputDir;
}

/**
 * 添加处理文件
 * 
 * @param {FileInfo} fileInfo 文件信息
 */
ProcessContext.prototype.addFile = function ( fileInfo ) {
    this.files[ fileInfo.path ] = fileInfo;
};

/**
 * 获取处理文件列表
 * 
 * @return {Array}
 */
ProcessContext.prototype.getFiles = function () {
    var files = this.files;
    var result = [];
    var keys = Object.keys( files );
    keys.forEach( function ( key ) {
        result.push( files[ key ] );
    } );

    return result;
};

/**
 * 根据路径获取处理文件
 * 
 * @param {string} path 路径
 * @return {FileInfo}
 */
ProcessContext.prototype.getFileByPath = function ( path ) {
    return this.files[ path ] || null;
};


/**
 * 遍历目录
 * 
 * @inner
 * @param {string} dir 目录路径
 * @param {ProcessContext} processContext 构建环境对象
 */
function traverseDir( dir, processContext ) {
    var files = fs.readdirSync( dir );

    files.forEach( function ( file ) {
        if ( file === '.svn' ) {
            return;
        }

        file = path.resolve( dir, file );
        var stat = fs.statSync( file );

        // if exclude, do nothing
        var relativePath = path.relative( processContext.baseDir, file );
        var isExclude = false;
        processContext.exclude.forEach( function ( excludeFile ) {
            if ( util.pathSatisfy( relativePath, excludeFile, stat ) ) {
                isExclude = true;
            }
        });
        if ( isExclude ) {
            return;
        }

        if ( stat.isDirectory() ) {
            traverseDir( file, processContext );
        }
        else {
            var fileData = new FileInfo( {
                data        : fs.readFileSync( file ),
                extname     : path.extname( file ).slice( 1 ),
                path        : relativePath,
                fullPath    : file
            } );
            processContext.addFile( fileData );
        }
    });
}

/**
 * 获取构建过程的处理器
 * 
 * @inner
 * @param {Array} processorOptions 处理器选项
 * @return {Array}
 */
function getProcessors( processorOptions ) {
    processorOptions = processorOptions || [];
    var processors = [];

    processorOptions.forEach( function ( option ) {
        if ( !option.name ) {
            return;
        }

        var Constructor = require( './processor/' + option.name );
        var processor = new Constructor( option );
        processor._name_ = option.name;
        processors.push( processor );
    } );

    return processors;
}

/**
 * 向配置模块里注入构建处理器
 * 
 * @inner
 * @param {Object} conf 配置模块
 */
function injectProcessor( conf ) {
    if ( conf && conf.injectProcessor ) {
        conf.injectProcessor( {
            JsCompressor   : require( './processor/js-compressor' ),
            LessCompiler   : require( './processor/less-compiler' ),
            CssImporter    : require( './processor/css-importer' ),
            PathMapper     : require( './processor/path-mapper' ),
            ModuleCompiler : require( './processor/module-compiler' )
        } );
    }
}

/**
 * 处理构建入口
 * 
 * @param {Object} conf 构建功能配置模块
 */
function process( conf ) {
    // 构建过程：
    // 1. 输入：自动遍历读取所有构建目录下文件，区分（文本/二进制）
    // 2. 使用conf.getProcessors获取processors
    // 3. 处理：processors对每个已读取的文件进行处理
    // 4. 输出：统一对处理结果进行输出，区分（文本/二进制）
    var exclude = conf.exclude || [];
    var baseDir = conf.input;
    var outputDir = conf.output;

    injectProcessor( conf );
    var processors = conf.getProcessors();
    var processContext = new ProcessContext( {
        baseDir: baseDir,
        exclude: exclude,
        outputDir: outputDir
    } );


    traverseDir( baseDir, processContext );
    var files = processContext.getFiles();
    var fileCount = files.length;
    var processorIndex = 0;
    var processorCount = processors.length;

    function nextProcess() {
        if ( processorIndex >= processorCount ) {
            outputFiles();
            return;
        }

        var processor = processors[ processorIndex++ ];
        var fileIndex = 0;
        nextFile();

        function nextFile() {
            if ( fileIndex >= fileCount ) {
                nextProcess();
                return;
            }

            var file = files[ fileIndex++ ];
            console.log( '[edp build] process ' + file.path 
                + ', use ' + processor.name );

            // processor处理文件
            // 此处需要保证异步性，否则可能因为深层次的层级调用产生不期望的结果
            // 比如错误被n次调用前的try捕获到
            processor.process( 
                file, 
                processContext, 
                function () { 
                    setTimeout( nextFile, 1 );
                } 
            );
        }
    }

    nextProcess();

    function outputFiles() {
        var mkdirp = require( 'mkdirp' );
        files.forEach( function ( file ) {
            if ( file.outputPath ) {
                var outputFile = path.resolve( outputDir, file.outputPath );
                var data = file.data;
                mkdirp.sync( path.dirname( outputFile ) );
                if ( typeof data === 'string' ) {
                    fs.writeFileSync( outputFile, data, 'UTF-8' );
                }
                else {
                    fs.writeFileSync( outputFile, data );
                }
            }
        } );
    }
}

module.exports = exports = process;

