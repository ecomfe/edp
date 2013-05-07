
function updateImage( callback, input, file, baseDir, outputDir ) {
    if ( typeof input != 'string' ) {
        input = input.toString( 'UTF-8' );
    }

    var segs = input.split( /(<!--|-->)/ );
    var data = [];

    function imgReplacer( match, attrStr ) {
        return '<img' 
            + attrStr.replace( 
                /src=(['"])([^'"]+)\1/, 
                function ( attr, start, value ) {
                    if ( 
                        /^[a-z]{2,9}:/i.test( value )
                    ) {
                        return attr;
                    }

                    return 'src=' + start 
                        + value.replace( 'src/', 'asset/' )
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
            data.push( seg.replace( /<img([^>]+)/g, imgReplacer ) );
        }
    }

    callback( data.join( '' ) );
}

require( '../main' ).addProcessor( 'html', updateImage );
