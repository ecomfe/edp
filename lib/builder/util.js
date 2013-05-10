exports.replaceTagAttribute = function ( content, tag, attribute, valueReplacer ) {
    var segs = content.split( /(<!--|-->)/ );
    var data = [];

    var attrReg = new RegExp( attribute + '=([\'"])([^\'"]+)\\1' );
    function replacer( match, attrStr ) {
        return '<' + tag 
            + attrStr.replace( 
                attrReg, 
                function ( attr, start, value ) {
                    return 'src=' + start 
                        + valueReplacer( value )
                        + start;
                }
            );
    }

    var tagReg = new RegExp( '<' + tag + '([^>]+)', 'g' );
    for ( var i = 0, len = segs.length; i < len; i++ ) {
        var seg = segs[ i ];
        if ( i % 2 ) {
            data.push( ( i === 0 ? '' : '-->' ), seg );
        }
        else {
            data.push( '<!--', seg.replace( tagReg, replacer ) );
        }
    }

    return data.join( '' );
};

exports.compressJavascript = function ( content ) {
    var UglifyJS = require( 'uglify-js' );
    var ast = UglifyJS.parse( content );

    // compressor needs figure_out_scope too
    ast.figure_out_scope();
    ast = ast.transform( UglifyJS.Compressor() );

    // need to figure out scope again so mangler works optimally
    ast.figure_out_scope();
    ast.compute_char_frequency();
    ast.mangle_names( { 
        except: [ '$', 'require', 'exports', 'module' ] 
    } );

    return ast.print_to_string();
};

exports.compileLessAsync = function () {

};
