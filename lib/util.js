/**
 * @file edp用到的工具函数
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com]
 * @module lib/devServer/util
 */

/**
 * 对象属性拷贝
 * 
 * @param {Object} target 目标对象
 * @param {...Object} source 源对象
 * @return {Object} 返回目标对象
 */
exports.extend = function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var src = arguments[i];
        if (src == null) {
            continue;
        }
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                target[key] = src[key];
            }
        }
    }
    return target;
};

/**
 * 混合对象
 * 
 * @param {...Object} source 要混合的对象
 * @return {Object} 混合后的对象
 */
exports.mix = function () {
    var o = {};
    var src = Array.prototype.slice.call(arguments);
    return exports.extend.apply(this, [o].concat(src));
};

exports.clone = function ( source ) {
    return JSON.parse( JSON.stringify( source ) );
};

/**
 * 编译handlebars模板
 * 
 * @param {string} file 模板文件
 * @param {string=} encoding 编码格式，默认utf-8
 * @return {Function}
 */
exports.compileHandlebars = function ( file, encoding ) {
    encoding = encoding || 'UTF-8';
    var Handlebars = require( 'handlebars' );
    var fs = require( 'fs' );
    var source = fs.readFileSync( file, encoding );

    return Handlebars.compile( source );
};

/**
 * 解压缩tgz文件
 * 
 * @param {string} tarball tgz文件名
 * @param {string} target 解压路径
 * @param {Function} callback 回调函数
 */
exports.unpack = function ( tarball, target, callback ) {
    var zlib = require( 'zlib' );
    var tar = require( 'tar' );
    var fs = require( 'fs' );
    var path = require( 'path' );
    var parentDir = path.resolve( target, '..' );

    require( 'mkdirp' ).sync( parentDir );
    var tmpName = (new Date()).getTime() + Math.random();
    var tmpDir = path.resolve( parentDir, './' + tmpName );

    require( 'fstream' )
        .Reader( { 
            type: 'File',
            path: tarball
        } )
        .pipe( zlib.createGunzip() )
        .pipe( tar.Extract( { path: tmpDir } ) )
        .on(
            'end',
            function () {
                fs.renameSync( 
                    path.resolve( tmpDir, './package' ), 
                    target 
                );
                fs.rmdirSync( tmpDir );
                callback && callback();
            }
        );
};

/**
 * 读取json文件
 * 
 * @param {string} file 文件路径
 * @return {Object} 
 */
exports.readJson = function ( file ) {
    var fs = require( 'fs' );
    var content = fs.readFileSync( file, 'UTF-8' );
    if ( content.charCodeAt( 0 ) === 0xFEFF ) {
        content = content.slice(1);
    }

    return JSON.parse( content );
};

/**
 * 将json数据序列化成字符串
 * 主要用于配置信息数据输出
 * 
 * @param {JSON} json 数据
 * @return {string}
 */
exports.stringifyJson = function ( json ) {
    return JSON.stringify( json, null, 4 );
};


/**
 * 读取文件声明的edp元数据信息
 * 元数据信息使用JSON格式声明，但不支持JSON null，number不支持`e`。
 * 注意：JSON字符串必须以双引号开头。
 * 
 * @param {string} file 文件路径
 * @param {string=} encoding 编码方式
 * @return {JSON} 
 */
exports.getFileMetadata = function ( file, encoding ) {
    var fs = require( 'fs' );
    if ( !fs.existsSync( file ) ) {
        throw new Error( file + ' is not exists!');
    }

    var START_TEXT = 'edp:';

    // 读取文件内容
    encoding = encoding || 'UTF-8';
    var lines = fs.readFileSync( file, encoding ).split( /\r?\n/ );
    var currentLine = 0;
    function nextLine() {
        if ( currentLine >= lines.length ) {
            return null;
        }

        return lines[ currentLine++ ];
    }

    // 读取注释中的metadata内容
    var isReadContentStart = 0;
    var content = [];
    while ( ( line = nextLine() ) != null ) {
        if ( isReadContentStart ) {
            if ( lineReplacer.test( line ) ) {
                content.push( line.replace( lineReplacer, '' ) );
            }
            else {
                break;
            }
        }
        else if ( 
            /^\s*(<!--|\/\/|\/\*|#)/.test( line ) 
            && line.indexOf( START_TEXT ) > 0 
        ) {
            isReadContentStart = 1;
            content.push( 
                line.slice( line.indexOf( START_TEXT ) + START_TEXT.length ) 
            );

            // 支持4种形式的注释识别
            var lineReplacer = {
                '<!--' : /^\s*/,
                '/*'   : /^\s*\**\s*/,
                '#'    : /^\s*#\s*/,
                '\/\/' : /^\s*\/\/\s*/
            }[ RegExp.$1 ];
        }
    }

    // 解析注释中的metadata内容
    content = content.join( '' );
    var len = content.length;
    var currentChar = 0;

    /**
     * 读取光标前移，返回当前字符
     * 
     * @inner
     * @return {string} 
     */
    function nextChar() {
        if ( currentChar >= len ) {
            return null;
        }

        return content[ currentChar++ ];
    }

    /**
     * 读取当前字符
     * 
     * @inner
     * @return {string} 
     */
    function currChar() {
        if ( currentChar >= len ) {
            return null;
        }

        return content[ currentChar ];
    }

    /**
     * 忽略空白字符，读取下一个期望遇见的有效字符
     * 
     * @inner
     * @param {string|RegExp} what 期望遇见的字符
     * @return {boolean} 
     */
    function meet( what ) {
        var c;
        while ( ( c = currChar() ) != null ) {
            if ( !/\s/.test( c ) ) {
                if ( what instanceof RegExp ) {
                    return what.test( c );
                }

                return what === c;
            }

            nextChar();
        }

        return false;
    }

    /**
     * 读取字符串
     * 
     * @inner
     */
    function readString() {
        nextChar();
        var c;
        while ( ( c = currChar() ) != null ) {
            switch ( c ) {
                case '\\':
                    nextChar();
                    break;
                case '"':
                    nextChar();
                    return;
            }

            nextChar();
        }
    }

    /**
     * 读取数字
     * 
     * @inner
     */
    function readNumber() {
        nextChar();
        var c;
        while ( ( c = currChar() ) != null ) {
            if ( !/[0-9.]/.test( c ) ) {
                return;
            }

            nextChar();
        }
    }

    /**
     * 读取bool值
     * 
     * @inner
     */
    function readBoolean() {
        if ( /^(true|false)/.test( content.slice( currentChar ) ) ) {
            currentChar += RegExp.$1.length;
        }
        else {
            throw new Error( '[EDP file metadata] Expect true/false' );
        }
    }

    /**
     * 读取数组
     * 
     * @inner
     */
    function readArray() {
        nextChar();
        while ( !meet( ']' ) ) {
            readAny();
        }

        nextChar();
    }

    /**
     * 读取对象
     * 
     * @inner
     */
    function readObject() {
        nextChar();
        while ( !meet( '}' ) ) {
            if ( meet( '"' ) ) {
                readString();
                meet( ':' );
                nextChar();
                readAny();
            }
            else if ( meet( ',' ) ) {
                nextChar();
            }
            else {
                throw new Error( '[EDP file metadata] name expect string' );
            }
        }

        nextChar();
    }

    /**
     * 读取任意类型
     * 
     * @inner
     */
    function readAny() {
        var readers = [
            { what: '"', method: readString },
            { what: /[-+0-9.]/, method: readNumber },
            { what: '{', method: readObject },
            { what: '[', method: readArray },
            { what: /[tf]/, method: readBoolean }
        ];

        for ( var i = 0; i < readers.length; i++ ){
            if ( meet( readers[ i ].what ) ) {
                readers[ i ].method();
                break;
            }
        }

        return i < readers.length;
    }

    if ( !readAny() ) {
        throw new Error( '[EDP file metadata] invalid format' );
    }
    
    return JSON.parse( content.slice( 0, currentChar ) );
};

/**
 * 读取文件的loader配置信息
 * 
 * @param {string} file 文件路径
 * @param {string=} encoding 文件编码
 * @return {Object}
 */
exports.readLoaderConfig = function ( file, encoding ) {
    encoding = encoding || 'UTF-8';
    var fs = require( 'fs' );
    var outputInfo = {};

    var content = fs.readFileSync( file, encoding );
    var index = content.search( /(require\.config\(\s*\{)/ );
    if ( index < 0 ) {
        return;
    }

    index += RegExp.$1.length - 1;

    // 取文件内容
    outputInfo.fileContent = content;

    // 取缩进层级
    var whitespace = 0;
    var startIndex = index;
    while ( content[ --startIndex ] === ' ' ) {
        whitespace++;
    }
    outputInfo.indentBase = whitespace / 4 + 1;

    // 查找loader config串的开始和结束位置
    var len = content.length;
    var braceLevel = 0;
    outputInfo.fromIndex = index;
    do {
        switch ( content[ index ] ) {
            case '{': 
                braceLevel++;
                break;
            case '}':
                braceLevel--;
                break;
        }

        index++;
    } while ( braceLevel && index < len );
    outputInfo.toIndex = index;

    // 取配置数据
    content = content.slice( outputInfo.fromIndex, index );
    outputInfo.data = eval( '(' + content + ')' );
    return outputInfo;
};
