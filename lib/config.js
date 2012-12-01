exports.command = 'config';

exports.description = 'Get and set config options.';

exports.init = function ( context ) {
	context.commander
        .command( exports.command )
        .description( exports.description )
        .action( context.processor.packMain( exports.main ) );
};

exports.main = function ( commands, args ) {
	console.log( commands );
	console.log( args );
};

