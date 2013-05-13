/***************************************************************************
 *
 * Copyright (c) 2013 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * icms.js ~ 2013/05/12 14:28:42
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 * ICMS上传文件，方便支持多个系统
 * 接口不太好用 :-(
 **/

/**
 * @constructor
 * @param {string} username The uuap account.
 * @param {string} password The uuap account password.
 */
function CmsCloudStorage(username, password) {
    this.username = username;
    this.password = password;
}

/**
 * @param {string} localFile The local file path.
 * @param {string} targetDir The target directory, such as
 * http://eiv.baidu.com/juejin/old_moban/haier/.
 * @param {string} sessid The uuap session id.
 */
CmsCloudStorage.prototype.upload = function(localFile, targetDir, sessid) {
    var querystring = require('querystring');
    var path = require('path');

    var targetUrl = 'http://icms.baidu.com:8080/' +
    // var targetUrl = 'http://localhost:9000/' +
    'cmscript/fire/id/cms_upload_file/?' + querystring.stringify({
        'action': 'check',
        'uploadType': 0,
        'MYSESSID': sessid,
        // 'folderId': targetDirId,
        'currentDir': targetDir
    });
    var basename = path.basename(localFile);

    var util = require('../util');
    var options = {
        data: {
            Filename: basename,
            Upload: 'Submit Query'
        },
        file: {
            name: 'commonfile',
            path: localFile
        },
        multipart: true
    };
    console.log('Uploading to %s/%s', targetDir.replace(/\/+$/g, ''), basename);
    util.httpPost(targetUrl, options, function(err, res, message) {
        if (err) {
            console.error(err);
            return;
        }

        var postBody = null;
        if (message.indexOf('ret:"success"') === 1) {
            // {ret:"success",err_info:"",result:"1",
            // file_name:"upload.js",unzip_file_path:"",exist_files:""}
            postBody = 'filenames=' + basename + '&unzip_file_paths=';
        } else if (message.indexOf('ret:"fail",err_info:"' +
                   basename + ':在选择的文件夹下有同名文件!"') === 1) {
            // {ret:"fail",err_info:"import.js:在选择的文件夹下有同名文件!",
            // result:"2",file_name:"import.js",unzip_file_path:"",
            // exist_files:"import.js"}
            console.log('Overwrting the exist files...');
            postBody = 'filenames=' + basename +
                '&unzip_file_paths=&exist_files=';
        } else {
            console.error(message);
            return;
        }

        var targetUrl = 'http://icms.baidu.com:8080/' +
        // var targetUrl = 'http://localhost:9000/' +
        'cmscript/fire/id/cms_upload_file/?' + querystring.stringify({
            'action': 'upload',
            'uploadType': 0,
            'currentDir': targetDir,
            // 'folderId': targetDirId,
            'imageCompressType': 0
        });

        var options = {
            data: postBody,
            headers: {
                'Cookie': 'MYSESSID=' + sessid
            }
        };
        util.httpPost(targetUrl, options, function(err, res, message) {
            if (err) {
                console.error(err);
                return;
            }

            if (message.indexOf('ret:"success"') === 1) {
                console.log(targetDir.replace(/\/+$/g, '') + '/' + basename);
            } else {
                console.log(message);
            }
        });
    });
};

exports.CmsCloudStorage = CmsCloudStorage;

exports.cli = {
    /**
     * @param {Array.<string>} args 命令行参数.
     * @param {Object.<string, string>} opts 命令的可选参数.
     */
    main: function(args, opts) {
        var file = args[0];
        if (!file) {
            console.error(exports.cli.usage);
            process.exit(0);
        }

        var fs = require('fs');
        if (!fs.existsSync(file)) {
            console.error('No such file or directory = [%s]', file);
            process.exit(0);
        }

        var config = require('../config');
        var sessid = config.get('upload.icms.sessid');
        if (!sessid) {
            console.error('Please set `upload.icms.sessid` first.');
            process.exit(0);
        }

        /*
        var username = config.get('upload.icms.username');
        var password = config.get('upload.icms.password');
        if (!username || !password) {
            console.error('Please set `upload.icms.username` and' +
                ' `upload.icms.password` first.');
            process.exit(0);
        }*/

        var targetDir = opts['target_dir'] ||
            config.get('upload.icms.target_dir');
        if (!targetDir) {
            console.error('Please specifiy the `targetDir`.');
            process.exit(0);
        }

        var sdk = new CmsCloudStorage(null, null);
        sdk.upload(file, targetDir, sessid);
    },
    command: 'icms',
    options: ['target_dir:'],
    usage: 'edp upload icms <file> ' +
           '[--target_dir=http://foo.baidu.com/static/dir/]',
    description: '通过cms上传文件'
};




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
