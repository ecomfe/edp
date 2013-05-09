var UglifyJS = require( 'uglify-js' );


function compress( callback, input, file ) {
    if ( typeof input != 'string' ) {
        input = input.toString( 'UTF-8' );
    }

    var ast = UglifyJS.parse( input );

    // compressor needs figure_out_scope too
    ast.figure_out_scope();
    ast = ast.transform( UglifyJS.Compressor() );

    // need to figure out scope again so mangler works optimally
    ast.figure_out_scope();
    ast.compute_char_frequency();
    ast.mangle_names( { 
        except: [ '$', 'require', 'exports', 'module' ] 
    } );

    callback( ast.print_to_string() );
}

require( '../main' ).addProcessor( 'js', compress );
