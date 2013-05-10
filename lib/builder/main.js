

var fs = require( 'fs' );
var path = require( 'path' );

function FileInfo( options ) {
    var data = options.data;
    // 二进制文件data为buffer
    // 文本文件data为字符串
    // 脑残才用gbk
    this.data = 
        /\u0000/.test( 
            data.toString( 0, Math.min( data.length, 4096 ) ) 
        )
        ? data
        : data.toString( 'UTF-8' );

    this.extname = options.extname;
    this.path = options.path;
    this.fullPath = options.fullPath;
    this.outputPath = this.path;
}

FileInfo.prototype.setData = function ( data ) {
    this.data = data;
};

FileInfo.prototype.finishProcess = function () {
    this.processFinished = 1;
};

FileInfo.prototype.isProcessFinished = function () {
    return !!this.processFinished;
};

function ProcessContext( options ) {
    this.files = {};
    this.baseDir = options.baseDir;
    this.exclude = options.exclude;
    this.outputDir = options.outputDir;
}

ProcessContext.prototype.addFile = function ( fileInfo ) {
    this.files[ fileInfo.path ] = fileInfo;
};

ProcessContext.prototype.getFiles = function () {
    var files = this.files;
    var result = [];
    var keys = Object.keys( files );
    keys.forEach( function ( key ) {
        result.push( files[ key ] );
    } );

    return result;
};


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


function traverseDir( dir, processContext ) {
    var files = fs.readdirSync( dir );

    files.forEach( function ( file ) {
        file = path.resolve( dir, file );

        // if exclude, do nothing
        var relativePath = path.relative( processContext.baseDir, file );
        var isExclude = false;
        processContext.exclude.forEach( function ( excludeFile ) {
            if ( isMatchExclude( relativePath, excludeFile ) ) {
                isExclude = true;
            }
        });
        if ( isExclude ) {
            return;
        }

        var stat = fs.statSync( file );
        if ( stat.isDirectory() ) {
            traverseDir( file, processContext );
        }
        else {
            var fileData = new FileInfo( {
                data        : fs.readFileSync( file ),
                extname     : path.extname( file ).slice( 1 ),
                path        : relativePath,
                fullPath    : file
            } );
            processContext.addFile( fileData );
        }
    });
}

function getProcessors( processorOptions ) {
    processorOptions = processorOptions || [];
    var processors = [];

    processorOptions.forEach( function ( option ) {
        if ( !option.name ) {
            return;
        }

        var Constructor = require( './processor/' + option.name );
        processors.push( new Constructor( option ) );
    } );

    return processors;
}

function process( baseDir, outputDir, exclude, processorOptions ) {
    exclude = exclude || [];

    var processors = getProcessors( processorOptions );
    var processContext = new ProcessContext( {
        baseDir: baseDir,
        exclude: exclude,
        outputDir: outputDir
    } );


    traverseDir( baseDir, processContext );
    var files = processContext.getFiles();
    var currentIndex = 0;
    function nextFile() {
        if ( currentIndex >= files.length ) {
            outputFiles();
            return;
        }

        var file = files[ currentIndex++ ];
        var processorIndex = 0;

        function nextProcess() {
            if ( processorIndex >= processors.length ) {
                nextFile();
                return;
            }
            var processor = processors[ processorIndex++ ];
            processor.process( file, processContext, nextProcess );
        }

        nextProcess();
    }
    nextFile();

    function outputFiles() {
        var mkdirp = require( 'mkdirp' );
        files.forEach( function ( file ) {
            if ( file.outputPath ) {
                var outputFile = path.resolve( outputDir, file.outputPath );
                var data = file.data;
                mkdirp.sync( path.dirname( outputFile ) );
                if ( typeof data === 'string' ) {
                    fs.writeFileSync( outputFile, data, 'UTF-8' );
                }
                else {
                    fs.writeFileSync( outputFile, data );
                }
            }
        } );
    }
}

module.exports = exports = process;

