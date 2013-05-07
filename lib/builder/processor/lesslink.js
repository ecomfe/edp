
function updateLink( callback, input, file, baseDir, outputDir ) {
    if ( typeof input != 'string' ) {
        input = input.toString( 'UTF-8' );
    }

    var segs = input.split( /(<!--|-->)/ );
    var data = [];

    function linkReplacer( match, attrStr ) {
        return '<link' 
            + attrStr.replace( 
                /href=(['"])([^'"]+)\1/, 
                function ( attr, start, value ) {
                    if ( 
                        /^[a-z]{2,9}:/i.test( value ) 
                        || !/.less$/.test( value )
                    ) {
                        return attr;
                    }

                    return 'href=' + start 
                        + value.replace( 'src/', 'asset/' )
                            .replace( /less$/, 'css' ) 
                        + start;
                }
            );
    }

    for ( var i = 0, len = segs.length; i < len; i++ ) {
        var seg = segs[ i ];
        if ( i % 2 ) {
            data.push( seg );
        }
        else {
            data.push( seg.replace( /<link([^>]+)/g, linkReplacer ) );
        }
    }

    callback( data.join( '' ) );
}

require( '../main' ).addProcessor( 'html', updateLink );
