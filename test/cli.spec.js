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
 * lib/cmd.js的测试用例
 **/
var cmd = require( '../lib/cmd' );

describe('cmd', function(){
    it('getCommandArguments', function(){
        var x = cmd.getCommandArguments(
            [ 'list', 'help' ],
            [ '--list', '123', '-h', '456' ]
        );
        expect( x.args ).toEqual( [ '123', '456' ]);
        expect( x.opts ).toEqual( {
            l: true,
            list: true,
            h: true,
            help: true
        } );

        x = cmd.getCommandArguments(
            [ 'list:', 'help', 'a' ],
            [
                '--list', '123',
                '-h', '456',
                '-a', 'zk'
            ]
        );
        expect( x.args ).toEqual( [ '456', 'zk' ] );
        expect( x.opts ).toEqual( {
            list: '123',
            l: '123',
            h: true,
            help: true,
            a: true
        });
    });
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
