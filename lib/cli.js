/**
 * @file 命令行功能模块
 * @author errorrik[errorrik@gmail.com]
 */
var fs = require( 'fs' );
var path = require( 'path' );

var edp = require( 'edp-core' );

process.env[ 'EDP_ROOT_PATH' ] = path.join( __dirname, '..' );

/**
 * 解析选项信息。选项信息格式示例：
 *
 * + `h`: -h
 * + `help`: -h 或 --help
 * + `output:`: -o xxx 或 --output xxx 或 --output=xxx
 *
 * @inner
 * @param {string|Object} option 选项信息
 * @return {Object}
 */
function parseOption( option ) {
    if ( typeof option === 'string' ) {
        if ( /^([-_a-zA-Z0-9]+)(:)?$/i.test( option ) ) {
            var name = RegExp.$1;
            option = {};
            option.requireValue = !!RegExp.$2;
            if ( name.length > 1 ) {
                option.name = name.charAt( 0 );
                option.fullname = name;
            }
            else {
                option.name = name;
            }
        }
        else {
            throw new Error( 'Option string is invalid: ' + option );
        }
    }

    return option;
};

/**
 * 扫描pkg，建立好索引之后，查找命令模块.
 * edp import 
 *   -> edp package import
 *     -> edp-package/lib/import.js
 *
 * @param {string} pkg npm的包名.
 * @param {Array.<string>} 命令行参数，用来确定sub module的.
 * @return {{name:string, module:(Object|null)}}
 */
exports.getCommandModule = function( pkg, args ) {
    var commandNode = require( './cmd' ).getCommands( pkg );
    var commandName = pkg.replace( /^edpx?-/, '' );

    while ( args.length ) {
        if ( commandNode.getChild( args[ 0 ] ) ) {
            commandName = args[ 0 ];
            commandNode = commandNode.getChild( commandName );
            args.shift();
        }
        else {
            break;
        }
    }

    // 无命令模块时直接错误提示并退出
    var commandModule = commandNode.module;
    if ( !commandModule ) {
        commandModule = null;
    }

    return {
        name: commandName,
        module: commandModule || null
    };
};

/**
 * 分析getCommandModule扫描之后剩余的process.argv，获取
 * 传递给command.main的参数.
 *
 * @param {Array.<string>} options
 * @param {Array.<string>} args
 *
 * @return {args:Array.<string>, opts:Object.<string, *>}
 */
exports.getCommandArguments = function( options, args ) {
    // 解析参数
    var commandArgs = [];
    var commandOptions = {};

    var moduleOptions = options || [];

    // XXX 所有的命令都支持help参数
    moduleOptions.push( 'help' );

    while ( args.length ) {
        var seg = args.shift();

        if ( /^-(-)?([-_a-zA-Z0-9]+)(=([^=]+))?$/i.test( seg ) ) {
            var optionInfo = {};
            optionInfo[ RegExp.$1 ? 'fullname' : 'name' ] = RegExp.$2;
            optionInfo.value = RegExp.$4;

            for ( var i = 0; i < moduleOptions.length; i++ ) {
                var opt = parseOption( moduleOptions[ i ] );
                if ( opt.fullname === optionInfo.fullname
                     || opt.name === optionInfo.name
                ) {
                    var value = true;
                    if ( opt.requireValue ) {
                        value = optionInfo.value || args.shift();
                    }

                    commandOptions[ opt.name ] = value;
                    opt.fullname && (commandOptions[ opt.fullname ] = value);
                    break;
                }
            }
        }
        else {
            commandArgs.push( seg );
        }
    }

    return {
        args: commandArgs,
        opts: commandOptions
    };
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

    var pkgConfig = JSON.parse(
        fs.readFileSync(
            path.join( __dirname, '..', 'package.json' ), 'utf-8' ) );

    var builtinCommands = pkgConfig.edp.extensions;
    var providerPackage = builtinCommands[ args[ 0 ] ];
    if ( !providerPackage ) {
        // 如果不是内置的command，转化一下
        // TODO edpx - ?
        providerPackage = 'edp-' + args[ 0 ];
        args.shift();
    }

    function done() {
        // 确定default command或者sub command
        var command = exports.getCommandModule( providerPackage, args );
        var commandModule = command.module;

        if ( !commandModule || !commandModule.cli ) {
            edp.log.error( 'Can not find the specified `%s\' command module from `%s\'.',
                args[ 0 ] || command.name, providerPackage );
            edp.log.error( 'DEBUG INFO: → %s', require.resolve( providerPackage ) );

            return;
        }

        var x = exports.getCommandArguments( commandModule.cli.options, args );

        // 扫描剩余的args，确定commandArgs和commandOptions
        if ( commandModule.cli && typeof commandModule.cli.main === 'function' ) {
            // 运行命令
            if ( x.opts.help === true ) {
                require( './help' ).displayCommandHelp(
                    args[ 0 ] || command.name, providerPackage );
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
        // TODO
        throw ex;
        // edp.pkg.install( providerPackage ).then( done, fail );
    }
};

if ( !module.parent ) {
    exports.parse( process.argv );
}
