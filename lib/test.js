/**
 * @file 测试模块
 * @author chris[wfsr@foxmail.com]
 */


var fs = require( 'fs' );
var path = require( 'path' );


/**
 * 命令行配置项
 *
 * @inner
 * @type {Object}
 */
var cli = {};

/**
 * 命令名称
 *
 * @type {string}
 */
cli.command = 'test';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '运行当前目录配置的测试用例。';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp test';

/**
 * 模块命令行运行入口
 *
 * @param {Array.<string>} args
 */
cli.main = function ( args ) {
    require('./util').require(
        'edp-test',
        function ( error, test ) {
            !error && test.start(args);           
        }
    );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;
