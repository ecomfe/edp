function JsCompressor( options ) {
}

JsCompressor.prototype.process = function ( file, processContext, callback ) {
    if ( file.extname === 'js' ) {
        var util = require( '../util' );
        file.setData( util.compressJavascript( file.data ) );
    }

    callback();
};

module.exports = exports = JsCompressor;
