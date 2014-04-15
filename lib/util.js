/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * lib/util.js ~ 2014/04/15 16:35:50
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
exports.require = function( pkg ) {
    try {
        return require( pkg );
    }
    catch ( ex ) {
        var path = require( 'path' );
        var fs = require( 'fs' );

        // npm i -g edp edp-build edp-webserver

        // /foo/bar/edp/node_modules
        // /foo/bar/edp-build/node_modules
        // /foo/bar/edp-webserver/node_modules

        var dir = path.resolve( __dirname, '..', '..', pkg );
        if ( fs.existsSync( dir ) ) {
            try {
                return require( dir );
            }
            catch ( e2 ) {
                throw e2;
            }
        }
        else {
            throw e1;
        }
    }
};

exports.isInstalled = function( pkg ) {
    var fs = require( 'fs' );
    var path = require( 'path' );

    var d1 = path.join( __dirname, '..', 'node_modules', pkg );
    var d2 = path.resolve( __dirname, '..', '..', pkg );

    return fs.existsSync( d1 ) || fs.existsSync( d2 );
};

exports.resolve = function( pkg ) {
    function fix( dir ) {
        var idx = dir.lastIndexOf( pkg );
        if ( idx === -1 ) {
            throw new Error( 'Invalid package name' );
        }
        dir = dir.substr( 0, idx + pkg.length );

        return dir;
    }

    try {
        return fix( require.resolve( pkg ) );
    }
    catch ( e1 ) {
        var path = require( 'path' );
        var d2 = path.resolve( __dirname, '..', '..', pkg );
        try {
            return fix( require.resolve( d2 ) );
        }
        catch( e2 ) {
            throw e2;
        }
    }
};




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
