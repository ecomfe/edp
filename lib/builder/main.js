

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

function processDir( dir, baseDir, outputDir ) {
    var files = fs.readdirSync( dir );
    files.forEach( function ( file ) {
        file = path.resolve( dir, file );
        var stat = fs.statSync( file );
        if ( stat.isDirectory() ) {
            processDir( file, baseDir, outputDir );
        }
        else {
            processFile( file, baseDir, outputDir );
        }
    });
}

function process( baseDir, outputDir, exclude ) {
    var projectDir = require( '../project' ).findDir( baseDir );
    if ( projectDir ) {
        baseDir = projectDir;
    }

    processDir( baseDir, baseDir, outputDir );
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

require( './processor/lessc' );
require( './processor/lesslink' );
require( './processor/imagesrc' );
require( './outputer/lesssource' );
require( './outputer/imagesource' );

