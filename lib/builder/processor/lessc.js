var less = require( 'less' );

function compile( callback, input, file ) {
    if ( typeof input != 'string' ) {
        input = input.toString( 'UTF-8' );
    }

    var parser = new( less.Parser )( {
        paths: [ require( 'path' ).dirname( file ) ]
    } );

    parser.parse( 
        input,
        function ( error, tree ) {
            if ( error ) {
                throw error;
            }
            else {
                callback( tree.toCSS() );
            }
        }
    );
}

require( '../main' ).addProcessor( 'less', compile );
