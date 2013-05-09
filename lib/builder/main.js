

var fs = require( 'fs' );
var path = require( 'path' );


function getInputer( file ) {
    return function ( inputFile ) {
        return fs.readFileSync( inputFile );
    };
}

var outputers = {};
function getOutputer( file ) {
    var type = path.extname( file ).slice( 1 ).toLowerCase();
    function defaultOutputer( data, file, baseDir, outputDir ) {
        var outputFile = path.resolve( 
            outputDir, 
            path.relative( baseDir, file )
        );

        require( 'mkdirp' ).sync( path.dirname( outputFile ) );
        if ( typeof data == 'string' ) {
            fs.writeFileSync( outputFile, data, 'UTF-8' );
        }
        else {
            fs.writeFileSync( outputFile, data );
        }
    }

    return outputers[ type ] || defaultOutputer;
}

var processors = {};

function getProcessors( file ) {
    return processors[ path.extname( file ).slice( 1 ) ] || [];
}

function processFile( file, baseDir, outputDir ) {
    var inputer = getInputer( file );
    var data = inputer( file );

    var processors = getProcessors( file );
    var index = 0;
    var len = processors.length;
    function next( dataAfterProcess ) {
        data = dataAfterProcess || data;
        if ( index >= len ) {
            output();
            return;
        }

        var processor = processors[ index++ ];
        processor( next, data, file );
    }

    function output() {
        var outputer = getOutputer( file );
        outputer( data, file, baseDir, outputDir );
    }

    next();
}

function isMatchExclude( relativePath, exclude ) {
    var pathTerms = relativePath.split( '/' );
    var excludeTerms = exclude.split( '/' );

    if ( pathTerms.length != excludeTerms.length ) {
        return false;
    }

    for ( var i = 0; i < pathTerms.length; i++ ) {
        var reg = new RegExp( 
            '^'
            + excludeTerms[ i ]
                .replace( /\./g, '\\.' )
                .replace( /\*/g, '.*' )
            + '$'
        );

        if ( !reg.test( pathTerms[ i ] ) ) {
            return false;
        }
    }

    return true;
}

function processDir( dir, baseDir, outputDir, exclude ) {
    var files = fs.readdirSync( dir );
    files.forEach( function ( file ) {
        file = path.resolve( dir, file );

        // if exclude, do nothing
        var relativePath = path.relative( baseDir, file );
        var isExclude = false;
        exclude.forEach( function ( excludeFile ) {
            if ( isMatchExclude( relativePath, excludeFile ) ) {
                isExclude = true;
            }
        });
        if ( isExclude ) {
            return;
        }

        var stat = fs.statSync( file );console.log( file )
        if ( stat.isDirectory() ) {
            processDir( file, baseDir, outputDir, exclude );
        }
        else {
            processFile( file, baseDir, outputDir, exclude );
        }
    });
}

function process( baseDir, outputDir, exclude ) {
    exclude = exclude || [];
    processDir( baseDir, baseDir, outputDir, exclude );
}

module.exports = exports = process;

exports.addProcessor = function ( type, processor ) {
    processors[ type ] = processors[ type ] || [];
    processors[ type ].push( processor );
};

exports.addOutputer = function ( type, outputer ) {
    if ( type instanceof Array ) {
        type.forEach( function ( t ) {
            outputers[ t ] = outputer;
        } );
    }
    else {
        outputers[ type ] = outputer;
    }
};

// TODO: 暂时写这里，测试功能用
require( './processor/lessc' );
require( './processor/lesslink' );
require( './processor/imagesrc' );
require( './processor/jssrc' );
require( './processor/jscompress' );
require( './outputer/lesssource' );
require( './outputer/imagesource' );

