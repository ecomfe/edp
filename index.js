/**
 * @file package主脚本
 * @author errorrik[errorrik@gmail.com]
 */


var edp = require( './lib/edp' );

/**
 * 内建模块
 *
 * @const
 * @ignore
 * @type {Array}
 */
var BUILT_IN = [
    'config',
    'devServer'
];

// 装载内建模块
( function () {
    for ( var i = 0; i < BUILT_IN.length; i++ ) {
        var moduleName = BUILT_IN[ i ];
        edp.addModule(
            require( './lib/' + moduleName )
        );
    }
} )();

// 装载用户模块
( function () {
    var fs = require( 'fs' );
    var path = process.env.HOME + '/edp_modules';

    if ( fs.existsSync( path ) && fs.statSync( path ).isDirectory() ) {
        var files = fs.readdirSync( path );

        files.forEach( 
            function ( file ) {
                file = path + '/' + file;
                
                if ( fs.statSync( file ).isFile() ) {
                    var module = require( file );
                    edp.addModule( module );
                }
            } 
        );
    }
} )()


module.exports = edp;
