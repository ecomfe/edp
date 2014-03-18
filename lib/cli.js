/**
 * @file 命令行功能模块
 * @author errorrik[errorrik@gmail.com]
 */
var fs = require( 'fs' );
var path = require( 'path' );

var edp = require( 'edp-core' );

process.env[ 'EDP_ROOT_PATH' ] = path.join( __dirname, '..' );

/**
 * 解析参数。作为命令行执行的入口
 *
 * @param {Array} args 参数列表
 */
exports.parse = function ( args ) {
    args = args.slice( 2 );

    // 无参数时显示默认信息
    if ( args.length === 0 ) {
        require( './help' ).defaultInfo();
        return;
    }

    // 显示版本信息
    if ( args[ 0 ] === '--version' || args[ 0 ] === '-v' ) {
        console.log( 'edp version ' + require('./edp').version );
        return;
    }

    if ( args[ 0 ] === '--nobody' ) {
        // 这个参数貌似已经没用了
        args.shift();
    }

    var cmd = require( './cmd' );
    var providerPackage = cmd.lookupPackage( args[ 0 ] );

    function done() {
        // 确定default command或者sub command
        var command = cmd.getCommandModule( providerPackage, args );
        var commandModule = command.node.module;

        if ( !commandModule || !commandModule.cli ) {
            edp.log.error( 'Can not find the specified `%s\' command module from `%s\'.',
                command.name, providerPackage );
            edp.log.error( 'DEBUG INFO: → %s', require.resolve( providerPackage ) );

            return;
        }

        var x = cmd.getCommandArguments( commandModule.cli.options, args );

        // 扫描剩余的args，确定commandArgs和commandOptions
        if ( commandModule.cli && typeof commandModule.cli.main === 'function' ) {
            // 运行命令
            if ( x.opts.help === true ) {
                require( './help' ).displayCommandHelp( command.node, providerPackage );
            }
            else {
                commandModule.cli.main( x.args, x.opts );
            }
        }
        else {
            edp.log.error( 'Invalid edp module, There is no cli.main entry point.' );
        }
    }

    function fail( er ) {
        edp.log.error( er.toString() );
    }

    try {
        require( providerPackage );
        done();
    } catch ( ex ) {
        edp.log.warn( ex.toString() );

        var dir = path.join( __dirname, '..', 'node_modules', providerPackage );
        if ( !fs.existsSync( dir ) ) {
            edp.pkg.install( providerPackage ).then( done, fail );
        }
    }
};

if ( module === require.main ) {
    exports.parse( process.argv );
}
