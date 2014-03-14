/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * help.spec.js ~ 2014/03/13 17:01:04
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * lib/help.js的测试用例
 **/
var path = require( 'path' );
var help = require( '../lib/help' );

describe('help', function(){
    it('getUserCommands', function(){
        var dir = path.join( __dirname, 'node_modules' );
        var extensionCommands = help.getUserCommands( dir );
        expect( extensionCommands.length ).toBe( 1);

        var cmd = extensionCommands[ 0 ];
        var subs = help.expandCommands( cmd, cmd.name );
        expect( subs.length ).toBe( 1 );
        expect( subs[ 0 ] ).toEqual( [ 'edpx-bar bar', 'hello world' ] );
    });

    it('getBuiltinCommands', function(){
        var dir = path.join( __dirname, 'node_modules' );
        var builtinCommands = help.getBuiltinCommands( dir );
        expect( builtinCommands.length ).toBe( 3 );

        var cmd = builtinCommands[ 0 ];
        var subs = help.expandCommands( cmd, cmd.name );
        expect( subs.length ).toBe( 2 );
        expect( subs[ 0 ] ).toEqual( [ 'edp-bar bar', '' ] );
        expect( subs[ 1 ] ).toEqual( [ 'edp-bar zk', '' ] );

        cmd = builtinCommands[ 1 ];
        var subs = help.expandCommands( cmd, cmd.name );
        expect( subs.length ).toBe( 2 );
        expect( subs[ 0 ] ).toEqual( [ 'edp-foo foo', '' ] );
        expect( subs[ 1 ] ).toEqual( [ 'edp-foo foo zk', '' ] );

        cmd = builtinCommands[ 2 ];
        var subs = help.expandCommands( cmd, cmd.name );
        expect( subs.length ).toBe( 1 );
        expect( subs[ 0 ] ).toEqual( [ 'edp-xyz xyz zk', '' ] );
    });
});





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
