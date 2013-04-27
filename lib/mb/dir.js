
var util = require( './util' );

// try "node dir.js --output=outputfile --module-config configfile inputfile"
if ( util.isRunFromCli( __filename ) ) {
    console.log( 
        util.parseCliArgv( [
            'module-config:',
            'output:'
        ] ) 
    );
}