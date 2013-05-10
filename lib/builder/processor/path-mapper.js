function PathMapper( options ) {
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

    this.entryReplacements = options.entryReplacements;
    this.from = new RegExp( '(^|/)' + options.from );
    this.to = options.to;
}

PathMapper.prototype.process = function ( file, processContext, callback ) {
    var from = this.from;
    var to = this.to;

    function valueReplacer( value ) {
        if ( /^[a-z]{2,9}:/i.test( value ) ) {
            return value;
        }

        return value.replace( from, to );
    }
    
    var util = require( '../util' );
    if ( this.entryExtnames[ file.extname ] ) {
        this.entryReplacements.forEach( function ( replacement ) {
            file.setData(
                util.replaceTagAttribute( 
                    file.data, 
                    replacement.tag, 
                    replacement.attribute, 
                    valueReplacer
                )
            );
        } );
    }

    file.outputPath = file.outputPath.replace( from, to );
    callback();
};

module.exports = exports = PathMapper;
