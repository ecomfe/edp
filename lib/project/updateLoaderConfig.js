/**
 * @file 自动更新loader config
 * @author errorrik[errorrik@gmail.com]
 * @module lib/project/updateLoaderConfig
 */

var fs = require( 'fs' );
var path = require( 'path' );

function update( file, encoding ) {
    encoding = encoding || 'UTF-8';
    var content = fs.readFileSync( file, encoding );

    var index = content.search( /(require\.config\(\s*\{)/ );
    if ( index < 0 ) {
        return;
    }

    index += RegExp.$1.length - 1;

    var whitespace = 0;
    var startIndex = index;
    while ( content[ --startIndex ] === ' ' ) {
        whitespace++;
    }
    var indentBase = whitespace / 4 + 1;

    var len = content.length;
    var braceLevel = 0;
    startIndex = index;

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

    var confContent = content.slice( startIndex, index );
console.log(confContent)
    var configData = eval( '(' + confContent + ')' );
    configData.packages.push(1,2,3)
    var code = require( 'escodegen' ).generate(
        require('esprima').parse( '(' + JSON.stringify( configData ) + ')' ),
        {format: {escapeless:true,
            indent: {
            style: '    ',
            base: indentBase
        }} }
    );
    console.log( 
        content.slice( 0, startIndex ) 
        + code.replace( /(^\s*\(|\);$)/g, '' ) 
        + content.slice( index ) 
    );
}

function scanAndUpdate( dir, extnameRule ) {
    fs.readdirSync( dir ).forEach( 
        function ( file ) {
            if ( file === 'lib' || file.indexOf( '.' ) === 0 ) {
                return;
            }

            var fullPath = path.resolve( dir, file );
            var stat = fs.statSync( fullPath );
            if ( stat.isDirectory() ) {
                scanAndUpdate( fullPath, extnameRule );
            }
            else if ( stat.isFile() 
                && extnameRule.test( path.extname( file ) ) 
            ) {
                update( fullPath );
            }
        }
    );
}


function updateLoaderConfig() {
    var proj = require( '../project' );
    var projDir = proj.findDir();

    if ( !projDir ) {
        return;
    }
    
    var extnames = proj.getManifest().loaderAutoConfig;
    var extnameRule = new RegExp(
        '\\.(' + extnames.replace( /,/g, '|' ) + ')$'
    );
    scanAndUpdate( projDir, extnameRule );
}

module.exports = exports = updateLoaderConfig;
