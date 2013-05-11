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
    var util = require( '../util' );

    if ( file.extname === 'less' ) {
        file.outputPath = file.outputPath.replace( /\.less$/, '.css' );
        
        var parserOptions = {
            paths: [ require( 'path' ).dirname( file.fullPath ) ]
        };

        util.compileLessAsync( 
            file.data, 
            parserOptions, 
            function ( compiledCode ) {
                file.setData( compiledCode );
                callback();
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
