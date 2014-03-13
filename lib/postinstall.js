#!/usr/bin/env node
/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * lib/postinstall.js ~ 2014/03/13 17:30:14
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var fs = require( 'fs' );
var path = require( 'path' );

[ 'edp-bar', 'edp-foo', 'edp-xyz', 'edpx-bar' ].forEach(function( dir ){
    var srcpath = path.join( __dirname, '..', 'test', 'node_modules', dir );
    var dstpath = path.join( __dirname, '..', 'node_modules', dir );
    if ( !fs.existsSync( dstpath ) ) {
        fs.symlinkSync( srcpath, dstpath );
    }
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
