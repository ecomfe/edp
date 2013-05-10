function LessCompiler( options ) {
    // init entryExtnames
    var entryExtnames = {};
    var optExtnames = options.entryExtnames || [];
    if ( !(optExtnames instanceof Array) ) {
        optExtnames = optExtnames.split( /\s*,\s*/ );
    }
    optExtnames.forEach(
        function ( extname ) {
            entryExtnames[ extname ] = 1;
        }
    );
    this.entryExtnames = entryExtnames;
}

LessCompiler.prototype.process = function ( file, processContext, callback ) {
    if ( file.extname === 'less' ) {
        file.outputPath = file.outputPath.replace( /\.less$/, '.css' );

        var less = require( 'less' );
        var parser = new( less.Parser )( {
            paths: [ require( 'path' ).dirname( file.fullPath ) ]
        } );

        parser.parse(
            file.data,
            function ( error, tree ) {
                if ( error ) {
                    throw error;
                }
                else {
                    file.setData( tree.toCSS() );
                    callback();
                }
            }
        );

        return;
    }
    else if ( this.entryExtnames[ file.extname ] ) {
        file.setData(
            util.replaceTagAttribute( 
                file.data, 
                'link', 
                'href', 
                function ( value ) {
                    return value.replace( /\.less$/, '.css' );
                }
            )
        );
    }

    callback();
};

module.exports = exports = LessCompiler;
