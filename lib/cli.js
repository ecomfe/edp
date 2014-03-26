/**
 * @file 命令行功能模块
 * 
 * @author errorrik[errorrik@gmail.com]
 *         leeight[liyubei@baidu.com]
 */


var fs = require( 'fs' );
var path = require( 'path' );

var edp = require( 'edp-core' );

process.env[ 'EDP_ROOT_PATH' ] = path.join( __dirname, '..' );

/**
 * Mac OS X下面有的同学是通过*.pkg安装的nodejs，这样子可能会有一些问题
 * 例如：必须使用`sudo npm install <pkg>`的方式来安装，而无法使用`npm install <pkg>`
 */
function checkEnv() {
    if ( process.platform === 'win32' ) {
        return;
    }

    var cmd = process.execPath;
    if ( !fs.existsSync( cmd ) ) {
        edp.log.warn( 'No such file %s', cmd );
        return;
    }

    var stats = fs.lstatSync( cmd );
    var uid = process.getuid();
    if ( stats.uid !== uid ) {
        edp.log.warn( 'Recommended using `homebrew` install `nodejs`, otherwise you may encounter some weird problems.' );
    }

    if ( process.env.SUDO_UID ) {
        edp.log.warn( 'Never using root to run `edp`, otherwise you may corrupt your system.' );
    }
};

function leaveRootMode() {
    if ( process.env.SUDO_UID ) {
        try {
            process.setuid( parseInt( process.env.SUDO_UID, 10 ) );
        }
        catch( ex ) {
            edp.log.warn( 'setuid failed, msg = %s', ex.toString() );
        }
    }
};

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
    var mainCommand = args[ 0 ];
    var providerPackage = cmd.lookupPackage( mainCommand );


    function done() {
        // 确定default command或者sub command
        var commandNode = cmd.getCommand( args );
        var commandModule = commandNode.module;

        if ( !commandModule || !commandModule.cli ) {
            edp.log.error( 'Can not find the specified `%s\' command module from `%s\'.',
                mainCommand, providerPackage );
            edp.log.error( 'DEBUG INFO: → %s', require.resolve( providerPackage ) );

            return;
        }

        var x = cmd.getCommandArguments( commandModule.cli.options, args );

        // 扫描剩余的args，确定commandArgs和commandOptions
        if ( commandModule.cli && typeof commandModule.cli.main === 'function' ) {
            // 运行命令
            if ( x.opts.help === true ) {
                require( './help' ).displayCommandHelp( commandNode );
            }
            else {
                // 运行命令之前，切换到正常的用户，否则可能导致创建的文件是属于root的
                leaveRootMode();
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

    checkEnv();

    try {
        require( providerPackage );
    } catch ( ex ) {
        edp.log.warn( ex.toString() );

        var dir = path.join( __dirname, '..', 'node_modules', providerPackage );
        if ( !fs.existsSync( dir ) ) {
            edp.pkg.install( providerPackage ).then( done, fail );
        }
        return;
    }

    done();
};

if ( module === require.main ) {
    exports.parse( process.argv );
}
