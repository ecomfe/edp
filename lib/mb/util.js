/**
 * @file module builder用到的工具函数
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 判断当前文件是否以命令行模式运行
 * 
 * @param {string} filename 文件路径
 * @return {boolean}
 */
exports.isRunFromCli = function ( file ) {
    return process.argv[ 1 ] === file;
};

/**
 * 解析命令行参数
 * 
 * @param {Array=} options 选项描述
 * @return {Object}
 */
exports.parseCliArgv = function ( options ) {
    options = options || [];
    var argv = process.argv.slice( 2 );

    var desc = {};
    options.forEach( function ( opt ) {
        if ( /:$/.test( opt ) ) {
            desc[ opt.replace( /:$/, '' ) ] = 2;
        }
        else {
            desc[ opt ] = 1;
        }
    } );

    var data = { args: [], options: {} };
    for ( var i = 0; i < argv.length; i++ ) {
        var arg = argv[ i ];
        if ( /^--?([-A-Z0-9]+)(=([^=]+))?$/i.test( arg ) ) {
            var name = RegExp.$1;
            var value = RegExp.$3;
            switch ( desc[ name ] ) {
                case 1:
                    data.options[ name ] = true;
                    break;
                case 2:
                    data.options[ name ] = value || argv[ ++i ];
                    break;
            }
        }
        else {
            data.args.push( arg );
        }
    }

    return data;
};

/**
 * 读取module-config文件
 * 
 * @param {string} file 文件路径
 * @return {Object}
 */
exports.readModuleConfig = function ( file ) {
    var fs = require( 'fs' );
    return JSON.parse( fs.readFileSync( file, 'UTF-8' ) );
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
    var moduleConfig = exports.readModuleConfig( moduleConfigFile );

    // try match packages
    var packages = moduleConfig.packages;
    for ( var i = 0; i < packages.length; i++ ) {
        var pkg = packages[ i ];
        var pkgName = pkg.name;
        var pkgLoc = pkg.location;

        if ( relativePath.indexOf( pkgLoc ) > -1 ) {
            if ( relativePath === pkgLoc + '/' + pkg.main ) {
                return pkgName;
            }

            return pkgName + relativePath.replace( pkgLoc, '' );
        }
    }

    // try match paths
    var pathKeys = Object.keys( moduleConfig.paths ).slice( 0 );
    pathKeys.sort( function ( a, b ) { return b.length - a.length; } );
    for ( var i = 0; i < pathKeys.length; i++ ) {
        var key = pathKeys[ i ];
        var modulePath = moduleConfig.paths[ key ];
        if ( relativePath.indexOf( modulePath ) === 0 ) {
            return key + relativePath.replace( modulePath, '' );
        }
    }

    // try match baseUrl
    var baseUrl = moduleConfig.baseUrl;
    if ( relativePath.indexOf( baseUrl ) === 0 ) {
        return relativePath.replace( baseUrl + '/', '' );
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
    var moduleConfig = exports.readModuleConfig( moduleConfigFile );
    var basePath = path.dirname( moduleConfigFile );

    // try match packages
    var packages = moduleConfig.packages;
    for ( var i = 0; i < packages.length; i++ ) {
        var pkg = packages[ i ];
        var pkgName = pkg.name;

        if ( moduleId.indexOf( pkgName ) === 0 ) {
            if ( moduleId == pkgName ) {
                moduleId += '/' + pkg.main;
            }

            return path.resolve( 
                basePath, 
                pkg.location, 
                moduleId.replace( pkgName, '.' ) 
            ) + '.js';
        }
    }

    // try match paths
    var pathKeys = Object.keys( moduleConfig.paths ).slice( 0 );
    pathKeys.sort( function ( a, b ) { return b.length - a.length; } );
    for ( var i = 0; i < pathKeys.length; i++ ) {
        var key = pathKeys[ i ];

        if ( moduleId.indexOf( key ) === 0 ) {
            return path.resolve( 
                basePath,
                moduleConfig.paths[ key ],
                moduleId.replace( key, '.' )
            ) + '.js';
        }
    }

    return path.resolve( 
        basePath,
        moduleConfig.baseUrl,
        moduleId
    ) + '.js';
};


