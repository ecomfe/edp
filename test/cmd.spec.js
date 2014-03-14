/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * test/cmd.spec.js ~ 2014/03/13 11:24:35
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var path = require( 'path' );
var cmd = require( '../lib/cmd' );

describe('cmd', function(){
    it('lookupPackage', function(){
        expect( cmd.lookupPackage( 'install' ) ).toBe( 'edp-core' );
        expect( cmd.lookupPackage( 'config' ) ).toBe( 'edp-config' );
        expect( cmd.lookupPackage( 'init' ) ).toBe( 'edpx-init' );
        expect( cmd.lookupPackage( 'project' ) ).toBe( 'edp-project' );
        expect( cmd.lookupPackage( 'xyz' ) ).toBe( 'edpx-xyz' );
    });

    it('getCommandModule', function(){
        var pkg = 'edp-foo';
        var args = [];
        var dir = './node_modules/edp-foo';
        var rootNode = cmd.getRootNode( pkg, dir );

        var module = cmd.getCommandModule( pkg, args, rootNode );
        expect( module.name ).toBe( 'foo' );
        expect( module.node.fullPath ).toBe( path.resolve( __dirname, dir, 'cli', 'foo.js' ) );

        module = cmd.getCommandModule( pkg, [ 'foo', 'zk' ], rootNode );
        expect( module.name ).toBe( 'zk' );
        expect( module.node.fullPath ).toBe( path.resolve( __dirname, dir, 'cli', 'foo', 'zk.js' ) );
    });

    it('getCommandModule2', function(){
        var pkg = 'edp-bar';
        var args = [];
        var dir = './node_modules/edp-bar';
        var rootNode = cmd.getRootNode( pkg, dir );

        var module = cmd.getCommandModule( pkg, args, rootNode );
        expect( module.name ).toBe( 'bar' );
        expect( module.node.fullPath ).toBe( path.resolve( __dirname, dir, 'cli', 'bar.js' ) );

        module = cmd.getCommandModule( pkg, [ 'zk' ], rootNode );
        expect( module.name ).toBe( 'zk' );
        expect( module.node.fullPath ).toBe( path.resolve( __dirname, dir, 'cli', 'zk.js' ) );
    });

    it('getCommandModule3', function(){
        var pkg = 'edp-xyz';
        var args = [];
        var dir = './node_modules/edp-xyz';
        var rootNode = cmd.getRootNode( pkg, dir );

        var module = cmd.getCommandModule( pkg, args, rootNode );
        expect( module.name ).toBe( 'xyz' );
        expect( module.node.module.cli ).toEqual( {} );
        expect( module.node.fullPath ).toBe( undefined );

        module = cmd.getCommandModule( pkg, [ 'xyz', 'zk' ], rootNode );
        expect( module.name ).toBe( 'zk' );
        expect( module.node.fullPath ).toBe( path.resolve( __dirname, dir, 'cli', 'xyz', 'zk.js' ) );
    });

    it('Builtin Command 1', function(){
        // edp zk
        //   -> "edp-foo": [ "zk" ]
        var pkg = 'edp-foo';
        var args = [ 'zk' ];
        var dir = './node_modules/edp-foo';
        var rootNode = cmd.getRootNode( pkg, dir );

        var module = cmd.getCommandModule( pkg, [ 'zk' ], rootNode );
        expect( module.name ).toBe( null );
        expect( module.node ).toBe( null );
    });

    it('Builtin Command 2', function(){
        // edp foo
        //   -> "edp-foo": [ "zk" ]
        var pkg = 'edp-foo';
        var dir = './node_modules/edp-foo';
        var rootNode = cmd.getRootNode( pkg, dir );

        var module = cmd.getCommandModule( pkg, [ 'foo' ], rootNode );
        expect( module.name ).toBe( 'foo' );
        expect( module.node ).not.toBe( null );
        expect( module.node.fullPath ).toBe( path.resolve(
            __dirname, dir, 'cli', 'foo.js'
        ) );
    });

    it('User Command 1', function(){
        // see getCommandModule3
    });
});



































/* vim: set ts=4 sw=4 sts=4 tw=100: */
