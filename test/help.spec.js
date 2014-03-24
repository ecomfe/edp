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
        expect( extensionCommands.length ).toBe( 1 );

        var cmd = extensionCommands[0];
        expect( cmd.module.cli.description ).toBe( 'hello world' );
    });

    it('getBuiltinCommands', function(){
        var dir = path.join( __dirname, 'node_modules' );
        var builtinCommands = help.getBuiltinCommands( dir );
        expect( builtinCommands.length ).toBe( 4 );

        builtinCommands.forEach( function ( commandNode ) {
            expect(['zk', 'bar', 'foo', 'xyz']).toContain(commandNode.name);
        });
    });
});





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
