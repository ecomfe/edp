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

    // FIXME 需要require(pkg)么?
    var rootCommandNode = new CommandNode( require( pkg ), pkg );

    scanDir( dir, rootCommandNode );

    return rootCommandNode;
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
                            var commandNode = new CommandNode( module );
                            parentNode.addChild( commandNode );
                        }
                    }
                    catch ( ex ) {
                        // do nothing
                    }
                }
                else if ( stat.isDirectory() && ( name !== 'node_modules' && name !== 'test' ) ) {
                    // FIXME getChild issue?
                    scanDir( fullPath, parentNode.getChild( name ) || parentNode );
                }
            }
        );
};




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
