/**
 * @file edp
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * Expose `route()`.
 */
exports = module.exports = route;

/**
 * route command to process module
 *
 * @public
 * @param {Array} args arguments
 */
function route( args ) {
	var moduleName = args[ 0 ];
	args.shift();

	var module = require( './' + moduleName );

	if ( module ) {
		module.process( args );
	}
	else {
		console.warm( moduleName + 'is unknown!' );
	}
}
