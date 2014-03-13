/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * lib/cmd.js ~ 2014/03/10 10:14:38
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 
 **/
var path = require( 'path' );

var CommandNode = require( './node' ).CommandNode;

/**
 * @param {string} pkg 需要扫描的pkg.
 */
exports.getCommands = function( pkg ) {
    var file = require.resolve( pkg );
    var dir = path.dirname( file );
    return exports.getRootNode( pkg, dir );
};

/**
 * 扫描目录，获取命令的根节点.
 * @return {CommandNode}
 */
exports.getRootNode = function( pkg, dir ) {
    var rootCommandNode = new CommandNode( {}, pkg );
    scanDir( path.join( dir, 'cli' ), rootCommandNode );
    return rootCommandNode;
};

/**
 * 根据main cmd来定位所处的pakcage.
 * @param {string} cmd main cmd.
 * @return {string}
 */
exports.lookupPackage = function( cmd ) {
    var fs = require( 'fs' );
    var pkgConfig = JSON.parse(
        fs.readFileSync(
            path.join( __dirname, '..', 'package.json' ), 'utf-8' ) );

    var extensions = pkgConfig.edp.extensions;
    for ( var pkg in extensions ) {
        if ( extensions[ pkg ].indexOf( cmd ) !== -1 ) {
            return pkg;
        }
    }

    if ( extensions[ 'edp-' + cmd ] ) {
        return 'edp-' + cmd;
    }

    return 'edpx-' + cmd;
};

/**
 * 扫描pkg，建立好索引之后，查找命令模块.
 * edp import 
 *   -> edp package import
 *     -> edp-package/lib/import.js
 *
 * @param {string} pkg npm的包名.
 * @param {Array.<string>} 命令行参数，用来确定sub module的.
 * @param {CommandNode=} opt_rootNode 自定义的root节点.
 * @return {{name:string, module:(Object|null)}}
 */
exports.getCommandModule = function( pkg, args, opt_rootNode ) {
    var rootNode = opt_rootNode || exports.getCommands( pkg );

    var commandNode = rootNode;
    var commandName = pkg.replace( /^edpx?-/, '' );

    if ( !args.length ) {
        args.push( commandName );
    }

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

    return {
        name: commandName,
        node: commandNode
    };
};


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
 * 扫瞄目录，用于建立命令模块索引
 *
 * @param {string} dir 目录路径名
 * @param {CommandNode=} parentNode 命令路径
 */
function scanDir( dir, parentNode ) {
    var fs = require( 'fs' );
    var path = require( 'path' );

    fs.readdirSync( dir )
        .sort(
            function( file ) {
                var fullPath = path.resolve( dir, file );
                if ( fs.statSync( fullPath ).isDirectory() ) {
                    return 1;
                }

                return -1;
            }
        )
        .forEach(
            function ( file ) {
                var fullPath = path.resolve( dir, file );
                var stat = fs.statSync( fullPath );
                var extName = path.extname( file );
                var name = path.basename( file, extName );

                if ( stat.isFile() && /^\.js$/i.test( extName ) ) {
                    try {
                        var module = require( fullPath );
                        var cli = module.cli;
                        if ( cli ) {
                            // 不需要人肉配置cli.command了，command的内容跟文件名保持一致.
                            cli.command = name;
                            var commandNode = new CommandNode( module );
                            commandNode.fullPath = fullPath;
                            parentNode.addChild( commandNode );
                        }
                    }
                    catch ( ex ) {
                        // do nothing
                    }
                }
                else if ( stat.isDirectory() ) {
                    // FIXME getChild issue?
                    // 如果目录结构是这样子的
                    // edpx-xyz/
                    //   cli/
                    //     xyz/
                    //       zk.js
                    //
                    // 执行的方式是 edp xyz zk
                    // 因为没有cli/xyz.js，所以走到zk.js的时候，是会出错的
                    var node = parentNode.getChild( name );
                    if ( !node ) {
                        // node的角色只是一个proxy，没有module.cli
                        node = new CommandNode( {} );
                        parentNode.addChild( node, name );
                    }
                    scanDir( fullPath, parentNode.getChild( name ) );
                }
            }
        );
};




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
