/***************************************************************************
 *
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * test_bcs.js ~ 2013/05/11 20:42:56
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 *
 **/
var should = require('should');
var bcs = require('./bcs');
var sdk = new bcs.BaiduCloudStorage('hello', 'world', 'http://bs.baidu.com');


describe('BaiduCloudStorage', function() {
    describe('#sign()', function() {
        it('should', function() {
            // http://bs.baidu.com/MyBucket/MyObjectName.js?sign=MBO:hello:EiTlpkhgKQs3Aq8W1vKOfoUiPmY%3D
            // http://bs.baidu.com/MyBucket/%E6%88%91%E7%9A%84%E5%AF%B9%E8%B1%A1.js?sign=MBO:hello:HmlIq7%2BW47ChUOu%2B8uVV/%2B65FG8%3D
            // http://bs.baidu.com/我的Bucket/%E6%88%91%E7%9A%84%E5%AF%B9%E8%B1%A1.js?sign=MBO:hello:oDCTJxyleknGq6Q9klFARYXVw38%3D
            // http://bs.baidu.com/我的Bucket/?sign=MBO:hello:6GSKl3KApeBaEqZXosiBm46Fj3M%3D
            sdk.sign('PUT', 'MyBucket', '/MyObjectName.js').should.equal(
                'http://bs.baidu.com/MyBucket/MyObjectName.js?sign=MBO:hello:EiTlpkhgKQs3Aq8W1vKOfoUiPmY%3D');
            sdk.sign('GET', 'MyBucket', '/我的对象.js').should.equal(
                'http://bs.baidu.com/MyBucket/%E6%88%91%E7%9A%84%E5%AF%B9%E8%B1%A1.js?sign=MBO:hello:HmlIq7%2BW47ChUOu%2B8uVV/%2B65FG8%3D');
            sdk.sign('GET', '我的Bucket', '/我的对象.js').should.equal(
                'http://bs.baidu.com/我的Bucket/%E6%88%91%E7%9A%84%E5%AF%B9%E8%B1%A1.js?sign=MBO:hello:oDCTJxyleknGq6Q9klFARYXVw38%3D');
            sdk.sign('PUT', '我的Bucket', '/').should.equal(
                'http://bs.baidu.com/我的Bucket/?sign=MBO:hello:6GSKl3KApeBaEqZXosiBm46Fj3M%3D');
        });
    });

    describe('#_getObjectName()', function() {
        it('should', function() {
            var path = require('path');
            sdk._getObjectName(path.resolve(__dirname, 'dummy.js')).should.equal('/f5a68660ddfdaaf417d2704097ea141a.js');
            sdk._getObjectName(path.resolve(__dirname, 'logo.gif')).should.equal('/aba001c53c2b164f598c482461a79f3b.gif');
        });
    });
});



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
