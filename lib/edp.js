/**
 * @file edp
 * @author errorrik[errorrik@gmail.com]
 */


exports.version = '1.0.0';

var fs = require( 'fs' );
var modules = [];
var processor = {
    packMain: function ( mainFunc ) {
        return function () {
            var args     = arguments;
            var argLen   = args.length;
            mainFunc( 
                Array.prototype.slice.call( args, 0, argLen - 1 ),
                args[ argLen - 1 ]
            );
        };
    }
};
var context;

exports.addModule = function ( module ) {
    modules.push( module );
};

exports.init = function ( ctx ) {
    context = ctx;
    context.processor = processor;
    initBuiltinModule();
    initUserModule();
};

function initModule( module ) {
    module.init( context );
}

function initBuiltinModule() {
    for ( var i = 0; i < modules.length; i++ ) {
        var module = modules[ i ];
        initModule( module );
    }
}

function initUserModule() {
    var path = process.env.HOME + '/edp_modules';

    if ( fs.existsSync( path ) && fs.statSync( path ).isDirectory() ) {
        var files = fs.readdirSync( path );

        files.forEach( 
            function ( file ) {
                file = path + '/' + file;
                
                if ( fs.statSync( file ).isFile() ) {
                    var module = require( file );
                    initModule( module );
                    exports.addModule( module );
                }
            } 
        );
    }
}

