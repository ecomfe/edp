/**
 * @file edp用到的工具函数
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com], 
 *         leeight[leeight@gmail.com], 
 *         treelite[c.xinle@gmail.com]
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
 * @param {string} targetUrl The request url.
 * @param {{data:Object, headers:Object,
 *     multipart:boolean, file:Object}} options The post options.
 * @param {function(Error, http.ServerResponse,
 *     string)} callback The post handler.
 */
exports.httpPost = function(targetUrl, options, callback) {
    var url = require('url');
    var http = require('http');
    var path = require('path');
    var fs = require('fs');
    var querystring = require('querystring');

    var headers = exports.extend({}, options.headers);
    var postBody;
    if (options.multipart) {
        // var boundery = 'acrossthegreatwallwecanreacheverycornerintheworld';
        var boundery = '----------ae0Ef1Ef1ei4KM7ei4ae0ae0ei4cH2';
        postBody = [];
        if (options.data) {
            for(var key in options.data) {
                postBody.push(new Buffer(
                    '--' + boundery + '\r\n' +
                    'Content-Disposition: form-data; name="' + key + '"\r\n' +
                    '\r\n' +
                    options.data[key] + '\r\n'
                ));
            }
            if (options.file && fs.existsSync(options.file.path)) {
                postBody.push(new Buffer(
                    '--' + boundery + '\r\n' +
                    'Content-Disposition: form-data; name="' +
                    options.file.name + '"; ' +
                    'filename="' + path.basename(options.file.path) + '"\r\n' +
                    'Content-Type: application/octet-stream\r\n' +
                    '\r\n'
                ));
                postBody.push(fs.readFileSync(options.file.path));
                postBody.push(new Buffer('\r\n'));
            }
            postBody.push(new Buffer('--' + boundery + '--'));
            postBody = Buffer.concat(postBody);
        }
        headers['Content-Type'] = 'multipart/form-data; boundary=' + boundery;
        headers['Content-Length'] = postBody.length;
    } else {
        postBody = typeof options.data === 'string' ? options.data :
            querystring.stringify(options.data || {});
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        headers['Content-Length'] = Buffer.byteLength(postBody);
    }

    var o = url.parse(targetUrl);
    o['method'] = 'POST';
    o['headers'] = headers;
    var req = http.request(o, function(res){
        res.setEncoding('utf8');
        var chunks = [];
        res.on('data', function(chunk){
            chunks.push(chunk);
        });
        res.on('end', function(){
            callback(null, res, chunks.join(''));
        });
    });
    req.on('error', function(e){
        callback(e, null);
    });
    req.write(postBody);
    req.end();
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

    // 添加针对hash参数的forEach循环遍历
    Handlebars.registerHelper('forEach', function (context, options) {
        var res = [];
        var items = [];
        for (var key in context) {
            if (context.hasOwnProperty(key)) {
                items.push({key: key, value: context[key]});
            }
        }

        for (var i = 0, item; item = items[i]; i++) {
            item.last = i >= items.length - 1;
            res.push(options.fn(item));
        }
        return res.join('');
    });

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

exports.path = (function () {
    function normalize( sourcePath ) {
        return sourcePath.replace( /\\/g, '/' );
    }

    var path = require( 'path' );
    var normalizePath = {};

    [
        'normalize',
        'join',
        'resolve',
        'relative',
        'dirname',
        'basename',
        'extname'
    ].forEach(
        function ( method ) {
            normalizePath[ method ] = function () {
                 return normalize( 
                    path[ method ].apply( path, arguments ) 
                );
            };
        }
    );

    return normalizePath;
})();


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
exports.readLoaderConfigFile = function ( file, encoding ) {
    encoding = encoding || 'UTF-8';
    var fs = require( 'fs' );
    
    var content = fs.readFileSync( file, encoding );
    return exports.readLoaderConfig( content );
};

/**
 * 从内容中读取loader配置信息
 * 
 * @param {string} content 内容
 * @return {Object}
 */
exports.readLoaderConfig = function ( content ) {
    var outputInfo = {};
    var index = content.search( /(require\.config\(\s*\{)/ );
    if ( index < 0 ) {
        return;
    }

    index += RegExp.$1.length - 1;

    // 取文件内容
    outputInfo.content = content;

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

/**
 * 替换Loader配置信息
 * 
 * @param {Object} configData 新的配置信息数据
 * @param {Object} info 原配置数据信息对象，通常为readLoaderConfig的返回值
 * @return {string}
 */
exports.replaceLoaderConfig = function ( configData, info ) {
    var code = require( 'escodegen' ).generate(
        require( 'esprima' ).parse( '(' + JSON.stringify( configData ) + ')' ),
        {
            format: {
                escapeless:true,
                indent: {
                    style: '    ',
                    base: info.indentBase
                }
            }      
        }
    );

    return info.content.slice( 0, info.fromIndex ) 
        + code.replace( /(^\s*\(|\);$)/g, '' ) 
        + info.content.slice( info.toIndex ); 
};

/**
 * 替换html内容中的标签属性值
 * 
 * @param {string} content 内容
 * @param {string} tag 标签名
 * @param {string} attribute 属性名
 * @param {function(string)} valueReplacer 值替换函数
 * @return {string} 
 */
exports.replaceTagAttribute = function ( content, tag, attribute, valueReplacer ) {
    var attrReg = new RegExp( '(' + attribute + ')=([\'"])([^\'"]+)\\2' );
    var tagReg = new RegExp( '<' + tag + '([^>]+)', 'g' );
    function replacer( match, attrStr ) {
        return '<' + tag 
            + attrStr.replace( 
                attrReg, 
                function ( attr, attrName, start, value ) {
                    return attrName + '=' + start 
                        + valueReplacer( value )
                        + start;
                }
            );
    }

    return content.replace( tagReg, replacer );
};

/**
 * 压缩Javascript代码
 * 
 * @param {string} code Javascript源代码
 * @return {string} 
 */
exports.compressJavascript = function ( code ) {
    var UglifyJS = require( 'uglify-js' );
    var ast = UglifyJS.parse( code );

    // compressor needs figure_out_scope too
    ast.figure_out_scope();
    ast = ast.transform( UglifyJS.Compressor() );

    // need to figure out scope again so mangler works optimally
    ast.figure_out_scope();
    ast.compute_char_frequency();
    ast.mangle_names( { 
        except: [ '$', 'require', 'exports', 'module' ] 
    } );

    return ast.print_to_string();
};

/**
 * 编译less代码（异步）
 * 
 * @param {string} code less源代码
 * @param {Object} parserOptions 解析器参数
 * @param {function(string)} callback 编译完成回调函数
 */
exports.compileLessAsync = function ( code, parserOptions, callback ) {
    // 擦，less没有提供sync api
    var less = require( 'less' );
    var parser = new( less.Parser )( parserOptions );
    parser.parse(
        code,
        function ( error, tree ) {
            if ( error ) {
                throw error;
            }
            else {
                callback( tree.toCSS() );
            }
        }
    );
};


var estraverse = require( 'estraverse' );
var SYNTAX = estraverse.Syntax;
var LITERAL_DEFINE = 'define';
var LITERAL_REQUIRE = 'require';

/**
 * 分析模块
 * 
 * @inner
 * @param {Object} ast 模块代码的ast
 * @return {Object} 模块信息，包含id, dependencies, factoryAst
 */
function analyseModule( ast ) {
    var defineStat = ast.body[ 0 ];
    var defineExpr = defineStat 
        && defineStat.type === SYNTAX.ExpressionStatement
        && defineStat.expression;

    function isStringLiteral( node ) {
        return node 
            && node.type === SYNTAX.Literal 
            && typeof node.value === 'string';
    }

    var moduleId;
    var dependencies;
    var factoryAst;
    var defineArgs;

    if ( defineExpr 
        && defineExpr.callee.name === LITERAL_DEFINE 
        && ( defineArgs = defineExpr.arguments ) 
    ) {
        for ( var i = 0; i < defineArgs.length; i++ ) {
            var argument = defineArgs[ i ];
            if ( !moduleId && isStringLiteral( argument ) ) {
                moduleId = argument.value;
            }
            else if ( !dependencies && argument.type === SYNTAX.ArrayExpression ) {
                dependencies = [];
                argument.elements.forEach(
                    function ( element ) {
                        if ( isStringLiteral( element ) ) {
                            dependencies.push( element.value );
                        }
                        else {
                            throw new Error( 'Dependency must be string literal' );
                        }
                    }
                );
            }
            else {
                factoryAst = argument;
                break;
            }
        }

        if ( !dependencies ) {
            dependencies = [ 'require', 'exports', 'module' ];
        }

        if ( factoryAst.type === SYNTAX.FunctionExpression ) {
            estraverse.traverse(
                factoryAst,
                {
                    enter: function ( item ) {
                        if ( item.type !== SYNTAX.CallExpression ) {
                            return;
                        }

                        var arg0;
                        var value;
                            
                        if ( item.callee.name === LITERAL_REQUIRE
                            && ( arg0 = item.arguments[ 0 ] )
                            && isStringLiteral( arg0 ) 
                            && ( value = arg0.value ) 
                        ) {
                            dependencies.push( value );
                        }
                    }
                }
            );
        }

        return {
            id: moduleId,
            dependencies: dependencies,
            factoryAst: factoryAst
        };
    }

    return null;
}

/**
 * 生成模块代码
 * 
 * @inner
 * @param {Object} moduleInfo 模块信息，通常是analyseModule的返回结果
 * @return {string}
 */
function generateModuleCode( moduleInfo ) {
    var dependenciesExpr = {
        type: SYNTAX.ArrayExpression,
        elements: []
    };

    moduleInfo.dependencies.forEach( function ( dependency ) {
        dependenciesExpr.elements.push( {
            type: SYNTAX.Literal,
            value: dependency,
            raw: "'" + dependency + "'"
        });
    } );

    var ast = {
        type: 'Program',
        body: [
            {
                type: SYNTAX.ExpressionStatement,
                expression: {
                    type: SYNTAX.CallExpression,
                    callee: {
                        type: SYNTAX.Identifier,
                        name: LITERAL_DEFINE
                    },
                    arguments: [
                        {
                            type: SYNTAX.Literal,
                            value: moduleInfo.id,
                            raw: "'" + moduleInfo.id + "'"
                        },
                        dependenciesExpr,
                        moduleInfo.factoryAst
                    ]
                }
            }
        ]
    };
    
    return require( 'escodegen' ).generate( ast );
}

/**
 * 编译模块
 * 
 * @param {string} code 模块代码
 * @param {string} moduleId 模块id
 * @param {string} moduleConfig 模块配置文件
 * @param {boolean=} combine 是否合并依赖编译
 * @param {Object=} excludeModules 如果合并依赖，需要一个对象指定不需要合并的模块
 * @return {string} 
 */
exports.compileModule = function ( 
    code, 
    moduleId, 
    moduleConfig, 
    combine, 
    excludeModules 
) {
    var ast = require( 'esprima' ).parse( code );
    var moduleInfo = analyseModule( ast );
    if ( !moduleInfo ) {
        return false;
    }

    if ( !moduleInfo.id ) {
        moduleInfo.id = moduleId;
    }
    moduleId = moduleInfo.id;

    var codes = [ generateModuleCode( moduleInfo ) ];
    if ( combine ) {
        excludeModules = excludeModules || {
            'require': 1,
            'exports': 1,
            'module': 1
        };
        excludeModules[ moduleId ] = 1;

        var fs = require( 'fs' );
        var dependencies = moduleInfo.dependencies;
        for ( var i = 0; i < dependencies.length; i++ ){
            var depId = exports.resolveModuleId( dependencies[ i ], moduleId );
            var depFile = exports.getModuleFile( depId, moduleConfig );
            var packageInfo = exports.getPackageInfo( depId, moduleConfig );
            
            if ( !excludeModules[ depId ] && fs.existsSync( depFile ) ) {
                var depMainId = null;
                if ( packageInfo ) {
                    depMainId = depId + '/' + packageInfo.main;
                }

                codes.push( exports.compileModule( 
                    fs.readFileSync( depFile, 'UTF-8' ),
                    depMainId || depId,
                    moduleConfig, 
                    true, 
                    excludeModules
                ) );

                if ( depMainId ) {
                    codes.push(
                        'define(\'' + depId + '\', [\'' + depMainId 
                        + '\'], function (main) { return main; });'
                    );
                    excludeModules[ depId ] = 1;
                }
            }
        }
    }

    codes.reverse();
    return codes.join( '\n\n' );
};

/**
 * 判断url是否相对路径
 *
 * @param {string} url 路径
 * @return {boolean}
 */
exports.isRelativePath = function( url ) {
    return !/^([a-z]{2,10}:\/)?\//i.test( url );
};

/**
 * 判断url是否本地路径
 *
 * @param {string} url 路径
 * @return {boolean}
 */
exports.isLocalPath = function( url ) {
    return !/^[a-z]{2,10}:/i.test( url );
};

/**
 * 将相对的module id转换成绝对id
 * 
 * @param {string} id 要转换的id
 * @param {string} baseId 基础id
 * @return {string}
 */
exports.resolveModuleId = function ( id, baseId ) {
    if ( /^\.{1,2}/.test( id ) ) {
        var basePath = baseId.split( '/' );
        var namePath = id.split( '/' );
        var baseLen = basePath.length - 1;
        var nameLen = namePath.length;
        var cutBaseTerms = 0;
        var cutNameTerms = 0;

        pathLoop: for ( var i = 0; i < nameLen; i++ ) {
            var term = namePath[ i ];
            switch ( term ) {
                case '..':
                    if ( cutBaseTerms < baseLen - 1 ) {
                        cutBaseTerms++;
                        cutNameTerms++;
                    }
                    else {
                        break pathLoop;
                    }
                    break;
                case '.':
                    cutNameTerms++;
                    break;
                default:
                    break pathLoop;
            }
        }

        basePath.length = baseLen - cutBaseTerms;
        namePath = namePath.slice( cutNameTerms );

        basePath.push.apply( basePath, namePath );
        return basePath.join( '/' );
    }

    return id;
};

/**
 * 获取module id
 * 
 * @param {string} moduleFile module文件路径
 * @param {string} moduleConfigFile module配置文件路径
 * @return {string}
 */
exports.getModuleId = function ( moduleFile, moduleConfigFile ) {
    var path = exports.path;
    moduleFile = moduleFile.replace( /\.js$/, '' );
    var relativePath = path.relative( 
        path.dirname( moduleConfigFile ), 
        moduleFile
    );
    var moduleConfig = exports.readJson( moduleConfigFile );
    var baseUrl = moduleConfig.baseUrl + '/';

    // try match packages
    var packages = moduleConfig.packages || [];
    for ( var i = 0; i < packages.length; i++ ) {
        var pkg = packages[ i ];
        var pkgName = pkg.name;
        var pkgMain = pkg.main || 'main';
        var pkgLoc = pkg.location;

        if ( !exports.isRelativePath( pkgLoc ) ) {
            continue;
        }

        if ( relativePath.indexOf( pkgLoc ) === 0 ) {
            if ( relativePath === pkgLoc + '/' + pkgMain ) {
                return pkgName;
            }

            return pkgName + relativePath.replace( pkgLoc, '' );
        }
    }

    // try match paths
    var pathKeys = Object.keys( moduleConfig.paths || {} ).slice( 0 );
    pathKeys.sort( function ( a, b ) { return b.length - a.length; } );
    for ( var i = 0; i < pathKeys.length; i++ ) {
        var key = pathKeys[ i ];
        var modulePath = moduleConfig.paths[ key ];

        if ( !exports.isRelativePath( modulePath ) ) {
            continue;
        }

        modulePath = baseUrl + '/' + modulePath;
        if ( relativePath.indexOf( modulePath ) === 0 ) {
            return relativePath.replace( modulePath, key );
        }
    }

    // try match baseUrl
    if ( relativePath.indexOf( baseUrl ) === 0 ) {
        return relativePath.replace( baseUrl, '' );
    }

    return null;
};

/**
 * 获取模块id所属的package信息
 * 
 * @param {string} moduleId 模块id    
 * @param {string} moduleConfigFile 模块配置文件
 * @return {Object}
 */
exports.getPackageInfo = function ( moduleId, moduleConfigFile ) {
    var moduleConfig = exports.readJson( moduleConfigFile );
    var packages = moduleConfig.packages || [];
    for ( var i = 0; i < packages.length; i++ ) {
        var pkg = packages[ i ];
        var pkgName = pkg.name;

        if ( moduleId === pkgName ) {
            return {
                name: pkgName,
                location: pkg.location,
                main: pkg.main || 'main'
            };
        }
    }

    return null;
};

/**
 * 获取module文件路径
 * 
 * @param {string} moduleId module id
 * @param {string} moduleConfigFile module配置文件路径
 * @return {string}
 */
exports.getModuleFile = function ( moduleId, moduleConfigFile ) {
    var path = exports.path;
    var moduleConfig = exports.readJson( moduleConfigFile );
    var basePath = path.dirname( moduleConfigFile );

    // try match packages
    var packages = moduleConfig.packages || [];
    for ( var i = 0; i < packages.length; i++ ) {
        var pkg = packages[ i ];
        var pkgName = pkg.name;

        if ( moduleId.indexOf( pkgName ) === 0 ) {
            if ( moduleId == pkgName ) {
                moduleId += (pkg.main || 'main');
            }

            var pkgPath = pkg.location;
            if ( !exports.isRelativePath( pkgPath ) ) {
                return null;
            }

            return path.resolve( 
                basePath,
                pkgPath,
                moduleId.replace( pkgName, '' )
            ) + '.js';
        }
    }

    // try match paths
    var pathKeys = Object.keys( moduleConfig.paths || {} ).slice( 0 );
    pathKeys.sort( function ( a, b ) { return b.length - a.length; } );
    for ( var i = 0; i < pathKeys.length; i++ ) {
        var key = pathKeys[ i ];

        if ( moduleId.indexOf( key ) === 0 ) {
            var modulePath = moduleConfig.paths[ key ];
            if ( !exports.isRelativePath( modulePath ) ) {
                return null;
            }

            return path.resolve( 
                basePath,
                modulePath,
                moduleId.replace( key, '' )
            ) + '.js';
        }
    }

    return path.resolve( 
        basePath,
        moduleConfig.baseUrl,
        moduleId
    ) + '.js';
};

/**
 * 从内容中寻找入口模块
 * 
 * @param {string} content 查找内容源
 * @param {string} contentType 内容类型，js|html
 * @return {Array}
 */
exports.findEntryModules = function ( content, contentType ) {
    var mods = [];
    var modsCache = {};

    function findFromJsCode( code ) {
        var ast = require( 'esprima' ).parse( code );
        
        estraverse.traverse(
            ast,
            {
                enter: function ( node ) {
                    var arrayArg;
                    if ( node.type === SYNTAX.CallExpression 
                        && node.callee.name === LITERAL_REQUIRE
                        && ( arrayArg = node.arguments[ 0 ] )
                        && arrayArg.type === SYNTAX.ArrayExpression
                    ) {
                        arrayArg.elements.forEach( function ( item ) {
                            var value;
                            if ( item.type === SYNTAX.Literal 
                                && ( value = item.value )
                                && typeof value === 'string' 
                                && !modsCache[ value ]
                            ) {
                                mods.push( value );
                                modsCache[ value ] = 1;
                            }
                        } );
                    }
                }
            }
        );
    }

    if ( contentType === 'js' ) {
        findFromJsCode( content ); 
    }
    else {
        exports.findScriptTexts( content ).forEach( 
            function ( text ) {
                findFromJsCode( text );
            }
        );
    }

    return mods;
};

/**
 * html片段中查询script标签的innerText
 * 
 * @param {string} content html片段内容
 * @return {Array.<string>} 每个标签一个数组项
 */
exports.findScriptTexts = function ( content ) {
    // script标签就算有属性，属性值里总不会带有“>”吧
    var segs = content.split( /<script[^>]*>/ );
    var texts = [];
    for ( var i = 1; i < segs.length; i++ ) {
        texts.push( segs[ i ].split( /<\/script>/ )[ 0 ] );
    }

    return texts;
};

/**
 * 判断路径是否满足规则
 * 
 * @param {string} path 源路径
 * @param {string} rule 路径规则
 * @return {boolean}
 */
exports.pathSatisfies = function ( path, rule ) {
    var pathTerms = path.split( '/' );
    var ruleTerms = rule.split( '/' );

    if ( pathTerms.length != ruleTerms.length ) {
        return false;
    }

    for ( var i = 0; i < pathTerms.length; i++ ) {
        var reg = new RegExp( 
            '^'
            + ruleTerms[ i ]
                .replace( /\./g, '\\.' )
                .replace( /\*/g, '.*' )
            + '$'
        );

        if ( !reg.test( pathTerms[ i ] ) ) {
            return false;
        }
    }

    return true;
};

