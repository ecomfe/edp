/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * lib/help.js ~ 2014/03/10 10:03:52
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var edp = require( 'edp-core' );

var path = require( 'path' );
var fs = require( 'fs' );
var cmd = require( './cmd' );

/**
 * 获取内置的命令列表
 * @param {string=} opt_dir 需要查询的目录.
 * @return {Array.<CommandNode>}
 */
exports.getBuiltinCommands = function( opt_dir ) {
    var dir = opt_dir || path.join( __dirname, '..', 'node_modules' );

    var pkgs = fs.readdirSync( dir )
                 .filter( function( item ){
                     return /^edp-/.test( item );
                 });

    // 扫描每个node_modules/pkg，获取提供的commands.
    var builtinCommands = [];
    pkgs.forEach( function( pkg ) {
        builtinCommands.push( cmd.getCommands( pkg ) );
    });

    return builtinCommands;
};

/**
 * 获取扩展的命令列表
 * @param {string=} opt_dir 需要查询的目录.
 * @return {Array.<CommandNode>}
 */
exports.getExtensionCommands = function( opt_dir ) {
    var dir = opt_dir || path.join( __dirname, '..', 'node_modules' );

    var pkgs = fs.readdirSync( dir )
                 .filter( function( item ){
                     return /^edpx-/.test( item );
                 });

    var extensionCommands = [];
    pkgs.forEach( function( pkg ) {
        extensionCommands.push( cmd.getCommands( pkg ) );
    });

    return extensionCommands;
};


/**
 * 显示默认的帮助信息.
 * 扫描edp/node_modules目录，找到edp-xxx或者edpx-bar的目录
 */
exports.defaultInfo = function() {
    var builtinCommands = exports.getBuiltinCommands();

    // 输出builtinCommands和extensionCommands的内容
    var helpInfo = [];
    helpInfo.push( '## Builtin Commands' );
    buildHelpInfo( builtinCommands, helpInfo );

    var extensionCommands = exports.getExtensionCommands();
    if ( extensionCommands.length ) {
        helpInfo.push( '\n## Extension Commands' );
        buildHelpInfo( extensionCommands, helpInfo );
    }

    var msee = require( 'msee' );
    console.log( msee.parse( helpInfo.join( '\n' ) ) );
};

/**
 * @return {number} 最长的命令字符个数.
 */
function buildHelpInfo( commands, helpInfo ) {
    var sprintf = require( 'sprintf' ).sprintf;

    var pkgConfig = JSON.parse(
        fs.readFileSync(
            path.join( __dirname, '..', 'package.json' ), 'utf-8' ) );

    var builtinCommands = pkgConfig.edp.extensions;

    commands.forEach( function( cmd ) {
        var name = cmd.name.replace( /^edpx?-/, '' );

        var subs = [];
        exports.expandCommands( cmd, name, subs );
        if ( subs.length ) {
            subs.forEach( function( item ){
                var x = item[ 0 ];    // command name
                var y = item[ 1 ];    // command description

                var tokens = x.split( ' ' );
                if ( tokens.length === 2 ) {
                    if ( tokens[ 1 ] === 'default' ) {
                        x = tokens[ 0 ];
                    }

                    if ( builtinCommands[ tokens[ 1 ] ] === 'edp-' + tokens[ 0 ] ) {
                        x = tokens[ 1 ];
                    }
                }
                helpInfo.push( '* ' + sprintf( '%-20s %s', x, y ) );
            });
        }
    });
};

/**
 * @param {CommandNode} root 命名的根节点.
 * @param {string} parent 命令的前缀.
 * @param {Array.<string>} result 结果的内容.
 */
exports.expandCommands = function( root, parent, result ) {
    for ( var key in root.children ) {
        var cmd = root.children[ key ];
        var isProxy = ( cmd.module.proxy === true );
        var isValid = ( cmd.module && cmd.module.cli && cmd.module.cli.main );
        if ( isProxy || isValid ) {
            key = parent + ' ' + key;
            if ( isValid ) {
                var cli = cmd.module.cli;
                result.push( [ key, cli.description || '' ] );
            }
            exports.expandCommands( cmd, key, result );
        }
    }
};


/**
 * 显示command的帮助信息.
 *
 * @param {CommandNode} node command节点的实例
 * @param {string} pkg package的名称.
 */
exports.displayCommandHelp = function( node, pkg ) {
    var msee = require( 'msee' );
    var docFile = node.fullPath.replace( /\.js$/, '.md' );

    if ( fs.existsSync( docFile ) ) {
        var docText = msee.parseFile( docFile );
        console.log( docText );
    }
    else {
        var cli = node.module.cli;
        var docText = msee.parse(
            cli.command + '\n' +
            '---------\n' +
            '### Description\n\n' +
            cli.description || 'There is nothing left here.'
        );
        console.log( docText );
    }
};




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
