/**
 * @file 添加html文件的脚手架命令
 * @author errorrik[errorrik@gmail.com]
 * @module lib/addhtml
 */


/**
 * 默认html模板文件
 * 
 * @const
 * @ignore
 * @type {string}
 */
var TPL_FILE = './scaffold/html.tpl';

function getPackagesData( dir ) {
    var data = [];
    var pkgs = require( './import' ).getExists( dir );
    var libDir = require( './import' ).getLibDir( dir );
    var semver = require( 'semver' );
    var path = require( 'path' );

    for ( var key in pkgs ) {
        var pkgData = pkgs[ key ];
        var versions = Object.keys( pkgData );

        versions.sort( function ( v1, v2 ) {
            return semver.rcompare( v1, v2 );
        } );

        var version = versions[ 0 ];
        data.push( {
            name: key,
            version: versions[ 0 ],
            location: [ 
                path.relative( dir, libDir ), 
                key, 
                version, 
                'src' 
            ].join( '/' ),
            main: pkgData[ version ].main || 'main'
        } );
    }

    data.length > 0 && ( data[ data.length - 1 ].last = true );
    return data;
}

/**
 * 添加html文件
 * 
 * @param {string} file html文件
 * @param {Object=} tplData 模板数据
 * @param {string=} tplFile 模板文件
 */
function addhtml( file, tplData, tplFile ) {
    var util = require( './util' );
    var project = require( './project' );
    var path = require( 'path' );
    tplFile = tplFile || path.resolve( __dirname, TPL_FILE );
    file = path.resolve( process.cwd(), file );
    
    var tpl = util.compileHandlebars( tplFile );
    var data = {
        title: '[Please input title]',
        body: '[Page Body]'
    };
    util.extend( data, project.getManifest() );

    var loaderData = {};
    if ( data.loader ) {
        loaderData.loaderConfig = true;
        loaderData.loaderBaseUrl = '.';
        loaderData.loaderPaths = [];
        loaderData.loaderPackages = getPackagesData( path.dirname( file ) ); 
    }
    util.extend( data, loaderData, tplData );
    require( 'fs' ).writeFileSync( file, tpl( data ), 'UTF-8' );
}

module.exports = exports = addhtml;

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
cli.command = 'addhtml';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '添加html文件';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp addhtml <htmlfile>';

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 */
cli.main = function ( args ) {
    var htmlFile = args[ 0 ];
    if ( !htmlFile ) {
        console.log( '请输入html文件名' );
        return;
    }

    addhtml( htmlFile );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
