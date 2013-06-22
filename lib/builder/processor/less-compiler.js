/**
 * @file LESS编译的构建处理器
 * @author errorrik[errorrik@gmail.com]
 */


/**
 * LESS编译的构建处理器
 * 
 * @constructor
 * @param {Object} options 初始化参数
 * @param {string} options.entryExtnames 页面入口扩展名列表，`,`分隔的字符串
 */
function LessCompiler( options ) {
    // init entryExtnames
    var entryExtnames = {};
    var optExtnames = options.entryExtnames || [];
    if ( !(optExtnames instanceof Array) ) {
        optExtnames = optExtnames.split( /\s*,\s*/ );
    }
    optExtnames.forEach(
        function ( extname ) {
            entryExtnames[ extname ] = 1;
        }
    );
    this.entryExtnames = entryExtnames;
}

/**
 * 处理器名称
 * 
 * @type {string}
 */
LessCompiler.prototype.name = 'LessCompiler';

/**
 * 构建处理
 * 
 * @param {FileInfo} file 文件信息对象
 * @param {ProcessContext} processContext 构建环境对象
 * @param {Function} callback 处理完成回调函数
 */
LessCompiler.prototype.process = function ( file, processContext, callback ) {
    var util = require( '../../util' );

    if ( file.extname === 'less' ) {
        // 对less文件进行编译
        file.outputPath = file.outputPath.replace( /\.less$/, '.css' );
        
        var parserOptions = {
            paths: [ require( 'path' ).dirname( file.fullPath ) ]
        };
        try {
            util.compileLessAsync( 
                file.data, 
                parserOptions, 
                function ( error, compiledCode ) {
                    if ( error ) {
                        file.outputPath = null;
                    }
                    else {
                        file.setData( compiledCode );
                    }

                    callback();
                }
            );
        }
        catch ( ex ) {
            file.outputPath = null;
            callback();
        }

        return;
    }
    else if ( this.entryExtnames[ file.extname ] ) {
        // 替换页面入口文件对less资源的引用
        file.setData(
            util.replaceTagAttribute( 
                file.data, 
                'link', 
                'href', 
                function ( value ) {
                    return value.replace( /\.less$/, '.css' );
                }
            )
        );
    }
    else if ( file.extname == 'js' ) {
        file.setData(
            util.replaceRequireResource( 
                file.data, 
                'css', 
                function ( resourceId ) {
                    return resourceId.replace( /\.less$/, '.css' );
                }
            )
        );
    }

    callback();
};

module.exports = exports = LessCompiler;
