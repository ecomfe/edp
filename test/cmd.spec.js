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

var getExtensionsConfig = cmd.getExtensionsConfig;
cmd.getExtensionsConfig = function () {
    var extConfig = getExtensionsConfig();
    extConfig['edp-foo'] = [];
    extConfig['edp-xyz'] = [];
    extConfig['edp-bar'] = ['bar', 'zk'];
    return extConfig;
};

describe('cmd', function(){
    it('lookupPackage', function(){
        expect( cmd.lookupPackage( 'install' ) ).toBe( 'edp-core' );
        expect( cmd.lookupPackage( 'config' ) ).toBe( 'edp-config' );
        expect( cmd.lookupPackage( 'init' ) ).toBe( 'edpx-init' );
        expect( cmd.lookupPackage( 'project' ) ).toBe( 'edp-project' );
        expect( cmd.lookupPackage( 'xyz' ) ).toBe( 'edp-xyz' );
    });

    it('getCommand', function(){
        var dir = '../node_modules/edp-foo';

        var commandNode = cmd.getCommand( ['foo'] );
        expect( commandNode.name ).toBe( 'foo' );
        expect( commandNode.fullPath ).toBe(
            path.resolve( __dirname, dir, 'cli', 'foo.js' ) );

        commandNode = cmd.getCommand( [ 'foo', 'zk' ] );
        expect( commandNode.name ).toBe( 'zk' );
        expect( commandNode.fullPath ).toBe(
            path.resolve( __dirname, dir, 'cli', 'foo', 'zk.js' ) );
    });

    it('getCommand2', function(){
        var dir = '../node_modules/edp-bar';

        var commandNode = cmd.getCommand( ['bar'] );
        expect( commandNode.name ).toBe( 'bar' );
        expect( commandNode.fullPath ).toBe(
            path.resolve( __dirname, dir, 'cli', 'bar.js' ) );

        commandNode = cmd.getCommand( [ 'zk' ] );
        expect( commandNode.name ).toBe( 'zk' );
        expect( commandNode.fullPath ).toBe(
            path.resolve( __dirname, dir, 'cli', 'zk.js' ) );
    });

    it('getCommand3', function(){
        var dir = '../node_modules/edp-xyz';

        var commandNode = cmd.getCommand( ['xyz'] );
        expect( commandNode.name ).toBe( 'xyz' );
        expect( commandNode.cli ).toBeUndefined();
        expect( commandNode.fullPath ).toBeUndefined();

        commandNode = cmd.getCommand( [ 'xyz', 'zk' ] );
        expect( commandNode.name ).toBe( 'zk' );
        expect( commandNode.fullPath ).toBe(
            path.resolve( __dirname, dir, 'cli', 'xyz', 'zk.js' ) );
    });

    it('Builtin Command', function(){
        // edp foo
        //   -> "edp-foo": [ "zk" ]
        var dir = '../node_modules/edp-foo';

        var commandNode = cmd.getCommand( [ 'foo' ] );
        expect( commandNode.name ).toBe( 'foo' );
        expect( commandNode.fullPath ).toBe( path.resolve(
            __dirname, dir, 'cli', 'foo.js'
        ) );
    });

    it('User Command 1', function(){
        // see getCommandModule3
    });
});



































/* vim: set ts=4 sw=4 sts=4 tw=100: */
