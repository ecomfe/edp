/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * cli.spec.js ~ 2014/03/07 21:03:31
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * lib/cli.js的测试用例
 **/
var cli = require( '../lib/cli' );

describe('cli', function(){
    it('getCommandModule', function(){
        var providerPackage = 'edp-foo';
        var args = [];
        var cmd = cli.getCommandModule( providerPackage, args );
        expect( cmd ).not.toBe( null );
        expect( cmd.name ).not.toBe( null );
        expect( cmd.module ).not.toBe( null );
        expect( cmd.name ).toBe( 'foo' );

        args = [ 'a', 'b', 'c', 'd' ];
        cmd = cli.getCommandModule( providerPackage, args );
        expect( cmd.name ).toBe( 'foo' );

        args = [ '-a', 'b', 'c', 'd' ];
        cmd = cli.getCommandModule( providerPackage, args );
        expect( cmd.name ).toBe( 'foo' );

        args = [ 'zk', '-b', 'c', 'd' ];
        cmd = cli.getCommandModule( providerPackage, args );
        expect( cmd.name ).toBe( 'zk' );

        // -a应该被shift掉的
        args = [ '-a', 'zk', 'b', 'c', 'd' ];
        cmd = cli.getCommandModule( providerPackage, args );
        expect( cmd.name ).toBe( 'foo' );
    });

    it('getCommandArguments', function(){
        var x = cli.getCommandArguments(
            [ 'list', 'help' ],
            [ '--list', '123', '-h', '456' ]
        );
        expect( x.args ).toEqual( [ '123', '456' ]);
        expect( x.opts ).toEqual( { l: true, list: true, h: true, help: true } );

        x = cli.getCommandArguments(
            [ 'list:', 'help', 'a' ],
            [
                '--list', '123',
                '-h', '456',
                '-a', 'zk'
            ]
        );
        expect( x.args ).toEqual( [ '456', 'zk' ] );
        expect( x.opts ).toEqual( { list: '123', l: '123', h: true, help: true, a: true });
    });
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
