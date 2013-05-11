exports.replaceTagAttribute = function ( content, tag, attribute, valueReplacer ) {
    var segs = content.split( /(<!--|-->)/ );
    var data = [];

    var attrReg = new RegExp( attribute + '=([\'"])([^\'"]+)\\1' );
    var tagReg = new RegExp( '<' + tag + '([^>]+)', 'g' );
    function replacer( match, attrStr ) {
        return '<' + tag 
            + attrStr.replace( 
                attrReg, 
                function ( attr, start, value ) {
                    return 'src=' + start 
                        + valueReplacer( value )
                        + start;
                }
            );
    }

    return content.replace( tagReg, replacer );
};

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

exports.compileLessAsync = function ( code, parserOptions, callback ) {
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

exports.compileModule = function ( code, moduleId, moduleConfig, combine, excludeModules ) {
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

            if ( !excludeModules[ depId ] && fs.existsSync( depFile ) ) {
                codes.push( exports.compileModule( 
                    fs.readFileSync( depFile, 'UTF-8' ),
                    depId,
                    moduleConfig, 
                    true, 
                    excludeModules
                ) );
            }
        }
    }

    codes.reverse();
    return codes.join( '\n\n' );
};

/**
 * 读取module conf文件
 * 
 * @param {string} file 文件路径
 * @return {Object}
 */
exports.readModuleConf = function ( file ) {
    var fs = require( 'fs' );
    return JSON.parse( fs.readFileSync( file, 'UTF-8' ) );
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
    var path = require( 'path' );
    moduleFile = moduleFile.replace( /\.js$/, '' );
    var relativePath = path.relative( 
        path.dirname( moduleConfigFile ), 
        moduleFile
    );
    var moduleConfig = exports.readModuleConf( moduleConfigFile );

    // try match packages
    var packages = moduleConfig.packages || [];
    for ( var i = 0; i < packages.length; i++ ) {
        var pkg = packages[ i ];
        var pkgName = pkg.name;
        var pkgLoc = pkg.location;

        if (exports.isRelativePath(pkgLoc)) {
            pkgLoc = path.join(moduleConfig.baseUrl, pkgLoc);
        }

        if ( relativePath.indexOf( pkgLoc ) > -1 ) {
            if ( relativePath === pkgLoc + '/' + pkg.main ) {
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
        var modulePath = moduleConfig.paths[key];
        if (exports.isRelativePath(modulePath)) {
            modulePath = path.join(moduleConfig.baseUrl, moduleConfig.paths[ key ]);
        }
        if ( relativePath.indexOf( modulePath ) === 0 ) {
            return relativePath.replace( modulePath, key );
        }
    }

    // try match baseUrl
    var baseUrl = path.join(moduleConfig.baseUrl, '/');
    if ( relativePath.indexOf( baseUrl ) === 0 ) {
        return relativePath.replace( baseUrl, '' );
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
    var path = require( 'path' );
    var moduleConfig = exports.readModuleConf( moduleConfigFile );
    var basePath = path.dirname( moduleConfigFile );

    // try match packages
    var packages = moduleConfig.packages || [];
    for ( var i = 0; i < packages.length; i++ ) {
        var pkg = packages[ i ];
        var pkgName = pkg.name;

        if ( moduleId.indexOf( pkgName ) === 0 ) {
            if ( moduleId == pkgName ) {
                moduleId += '/' + pkg.main;
            }

            var pkgPath = pkg.location;
            if (exports.isRelativePath(pkgPath)) {
                pkgPath = path.join(basePath, moduleConfig.baseUrl, pkgPath);
            }

            return pkgPath + moduleId.replace(pkgName, '') + '.js';
        }
    }

    // try match paths
    var pathKeys = Object.keys( moduleConfig.paths || {} ).slice( 0 );
    pathKeys.sort( function ( a, b ) { return b.length - a.length; } );
    for ( var i = 0; i < pathKeys.length; i++ ) {
        var key = pathKeys[ i ];

        if ( moduleId.indexOf( key ) === 0 ) {
            var modulePath = moduleConfig.paths[key];
            if (exports.isRelativePath(modulePath)) {
                modulePath = path.join(basePath, moduleConfig.baseUrl, modulePath);
            }
            return modulePath + moduleId.replace(key, '') + '.js';
        }
    }

    return path.join( 
        basePath,
        moduleConfig.baseUrl,
        moduleId
    ) + '.js';
};

