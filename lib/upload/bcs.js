/***************************************************************************
 *
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * sdk.js ~ 2013/05/11 19:30:50
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 * 封装bcs的api
 **/

/**
 * @constructor
 * @param {string} ak The AccessKey.
 * @param {string} sk The SecretKey.
 * @param {string=} opt_host The bcs host.
 */
function BaiduCloudStorage(ak, sk, opt_host) {
    this.ak = ak;
    this.sk = sk;
    this.host = opt_host || 'http://bs.baidu.com';
}

/**
 * @see http://dev.baidu.com/wiki/bcs/index.php?title=sign
 * 只返回MBO的签名（Method, Bucket Name, Object Name），对于上传的
 * 应用足够了.
 * @param {string} method The request method.
 * @param {string} bucketName The bucket name.
 * @param {string} objectName The object name.
 *
 * @return {string} The url with signature.
 */
BaiduCloudStorage.prototype.sign = function(method, bucketName, objectName) {
    // base64_encode(hash_hmac('sha1', Content, SecretKey,true))
    var flag = 'MBO';
    var body = [
        'Method=' + method,
        'Bucket=' + bucketName,
        'Object=' + objectName
    ].join('\n');

    var content = flag + '\n' + body + '\n';

    var hmac = require('crypto').createHmac('sha1', this.sk);
    hmac.update(new Buffer(content, 'utf-8'));
    var digest = encodeURIComponent(hmac.digest('base64')).replace(/%2F/g, '/');

    var signature = [flag, this.ak, digest].join(':');
    var url = this.host + '/' + bucketName + '/' +
        encodeURIComponent(objectName.substr(1)) + '?sign=' + signature;
    return url;
};

/**
 * @param {string} localFile The local file path.
 */
BaiduCloudStorage.prototype._getObjectName = function(localFile) {
    var crypto = require('crypto');
    var fs = require('fs');
    var path = require('path');

    var md5sum = crypto.createHash('md5');
    md5sum.update(fs.readFileSync(localFile));
    return '/' + md5sum.digest('hex') + path.extname(localFile);
};

/**
 * @param {string} bucketName Bucket Name,.
 * @param {string} localFile The local file path.
 * @param {string=} opt_objectName The optional object Name.
 */
BaiduCloudStorage.prototype.upload = function(bucketName, localFile,
                                              opt_objectName) {
    var url = require('url');
    var http = require('http');
    var fs = require('fs');
    var data = fs.readFileSync(localFile);

    var objectName = opt_objectName || this._getObjectName(localFile);
    var targetUrl = this.sign('PUT', bucketName, objectName);
    // console.log(targetUrl);

    var options = url.parse(targetUrl);
    options['method'] = 'PUT';
    options['headers'] = {
        'Content-Length': data.length
    };

    var req = http.request(options, function(res) {
        if (res.statusCode === 200) {
            console.log(decodeURIComponent(targetUrl.replace(/\?.*/g, '')));
        } else {
            // console.log(JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
              console.log(chunk.toString());
            });
        }
    });
    req.on('error', function(e) {
        console.error('Problem with request: ' + e.message);
    });
    req.write(data);
    req.end();
};

exports.BaiduCloudStorage = BaiduCloudStorage;





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
