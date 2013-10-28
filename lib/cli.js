/**
 * @file 命令行功能模块
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 获取具有命令行功能的模块列表
 *
 * @inner
 * @param {string} baseDir 基础目录
 * @return {Array}
 */
function getModules( baseDir ) {
    var fs = require( 'fs' );
    var path = require( 'path' );
    var commandModules = [];

    fs.readdirSync( baseDir ).forEach(
        function ( file ) {
            file = path.resolve( baseDir, file );
            if ( fs.statSync( file ).isFile()
                 && path.extname( file ).toLowerCase() === '.js'
            ) {
                var module = require( file );
                if ( module.cli ) {
                    commandModules.push( module );
                }
            }
        }
    );

    return commandModules;
}

/**
 * 获取内建模块列表
 *
 * @return {Array}
 */
exports.getBuiltinModules = function () {
    return getModules( __dirname );
};

/**
 * 获取用户定义模块列表
 *
 * @return {Array}
 */
exports.getExtensionModules = function () {
    var modules = [];
    require( './extension' ).get().forEach( function ( ext ) {
        modules.push( getModules( ext ) );
    } );

    return Array.prototype.concat.apply( [], modules );
};

/**
 * 显示默认命令行信息
 *
 * @inner
 */
function defaultInfo() {
    var moduleNames = [];
    function readName( mod ) {
        moduleNames.push( mod.cli.command );
    }

    function pad(msg, length) {
        length = length || 16;
        if (msg.length < length) {
            return msg + new Array(length - msg.length).join(' ');
        }
        return msg;
    }

    console.log( 'Usage: edp <command> [<args>] [<options>]\n' );

    console.log( 'Builtin Commands:\n' );
    exports.getBuiltinModules().forEach(
        function( mod ) {
            var cli = mod.cli;
            var alias = cli.alias;
            console.log( '%s %s',
                pad( cli.command + (alias ? '(' + alias + ')' : '' ) ),
                (cli.description || '').replace(/(。|\.)$/, '')
            );
        }
    );
    console.log();

    moduleNames = [];
    exports.getExtensionModules().forEach( readName );
    if (moduleNames.length) {
        console.log( 'User Commands:' );
        console.log( moduleNames.join( ', ' ) );
        console.log();
    }

    console.log( 'See "edp help <command>" for more information.' );
}

/**
 * 命令节点类
 *
 * @inner
 * @constructor
 * @param {Object} mod 模块对象
 */
function CommandNode( mod ) {
    this.children = {};
    this.module = mod || null;
}

/**
 * 获取子节点
 *
 * @inner
 * @param {string} name 子节点名称
 * @return {CommandNode}
 */
CommandNode.prototype.getChild = function ( name ) {
    return this.children[ name ] || null;
};

/**
 * 添加子节点
 *
 * @inner
 * @param {Object} child 子节点模块
 */
CommandNode.prototype.addChild = function ( child ) {
    var mod = child.module;
    var cli = mod.cli;
    if ( cli ) {
        this.children[ cli.command ] = child;

        if ( cli.alias ) {
            this.children[ cli.alias ] = child;
        }
    }
};

/**
 * 获取子节点的模块
 *
 * @inner
 * @param {string} name 子节点名称
 * @return {Object}
 */
CommandNode.prototype.getChildModule = function ( name ) {
    var node = this.getChild( name );
    if ( node ) {
        return node.module;
    }

    return null;
};

/**
 * 命令模块索引
 *
 * @inner
 * @type {Object}
 */
var rootCommandNode = new CommandNode();

/**
 * 扫瞄目录，用于建立命令模块索引
 *
 * @param {string} dir 目录路径名
 * @param {string=} commandPath 命令路径
 */
function scanDir( dir, parentNode ) {
    parentNode = parentNode || rootCommandNode;
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
                            var commandNode = new CommandNode( module );
                            parentNode.addChild( commandNode );
                        }
                    }
                    catch ( ex ) {
                        // do nothing
                    }
                }
                else if ( stat.isDirectory() && name != 'node_modules' ) {
                    scanDir( fullPath, parentNode.getChild( name ) );
                }
            }
        );
}

// create module index
scanDir( __dirname );
require( './extension' ).get().forEach( function ( ext ) {
    scanDir( ext );
} );

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
}

/**
 * 纪录edp的运行历史
 *
 * @inner
 */
function saveCommandHistory() {
    var fs = require('fs');
    var historyFile = require('./edp').getConfig('.edp_history');
    var commandLog = '[' + new Date() + ']: ' + process.argv.join(' ') + '\n';
    fs.appendFile(historyFile, commandLog);
}

/**
 * 获取模块
 *
 * @param {string} command 命令名称
 * @return {Object}
 */
exports.getModule = function ( command ) {
    return rootCommandNode.getChildModule( command );
};

/**
 * 获取子模块列表
 *
 * @param {string} command 命令名称
 * @return {Array}
 */
exports.getSubModules = function ( command ) {
    var node = rootCommandNode.getChild( command );
    var modules = [];
    Object.keys( node.children ).forEach(
        function ( key ) {
            modules.push( node.getChildModule( key ) );
        }
    );

    return modules;
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
        defaultInfo();
        return;
    }

    // 显示版本信息
    if ( args[ 0 ] === '--version' || args[ 0 ] === '-v' ) {
        console.log( 'edp version ' + require('./edp').version );
        return;
    }

    // 查找命令模块
    var commandNode = rootCommandNode;
    var commandName;
    while ( args.length ) {
        commandName = args[ 0 ];
        if ( commandNode.getChild( commandName ) ) {
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
        console.log( 'Error command' );
        return;
    }

    // 解析参数
    var commandArgs = [];
    var commandOptions = {};
    while ( args.length ) {
        var seg = args.shift();

        if ( /^-(-)?([-_a-zA-Z0-9]+)(=([^=]+))?$/i.test( seg ) ) {
            var optionInfo = {};
            optionInfo[ RegExp.$1 ? 'fullname' : 'name' ] = RegExp.$2;
            optionInfo.value = RegExp.$4;

            var moduleOptions = commandModule.cli.options || [];
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

    // 检查user.name和user.email的配置，确保这两个配置项存在
    if ( commandName !== 'config' ) {
        var configModule = rootCommandNode.getChildModule( 'config' );
        if( configModule && !checkEnv() ) {
            return;
        }
    }

    // 记录运行的历史
    saveCommandHistory();

    // 运行命令
    commandModule.cli.main( commandArgs, commandOptions );

    // 检查当前运行的edp版本号
    require( './util/check-update' )();
};

function checkEnv() {
    var edpConfig = require( 'edp-config' );
    var pass = edpConfig.get('user.name') && edpConfig.get('user.email');

    var read = require('read');
    if (!edpConfig.get('user.name')) {
        read({prompt: 'user.name> '}, function(er, name){
            edpConfig.set('user.name', name);
            checkEnv();
        });
    } else if (!edpConfig.get('user.email')) {
        read({prompt: 'user.email> '}, function(er, name){
            edpConfig.set('user.email', name);
            checkEnv();
        });
    }

    return pass;
}
