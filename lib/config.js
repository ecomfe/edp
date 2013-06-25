/**
 * @file 配置模块
 * @author errorrik[errorrik@gmail.com]
 */

var fs = require( 'fs' );

/**
 * config file path
 * 
 * @const
 * @ignore
 * @type {string}
 */
var RC_FILE = require( 'path' ).resolve(
    require( './edp' ).getHome(),
    '.edprc' 
);

/**
 * default config
 * 
 * @const
 * @ignore
 * @type {Object}
 */
var DEFAULT_CONF = {
    'loader.url': 'http://s1.bdstatic.com/r/www/cache/ecom/esl/1-4-0/esl.js'
};

/**
 * 获取配置信息对象
 * 
 * @ignore
 * @return {Object}
 */
function getConf() {
    var conf = {};
    
    if ( fs.existsSync( RC_FILE ) ) {
        conf = JSON.parse( fs.readFileSync( RC_FILE, 'UTF-8' ) );
    }

    return conf;
}

/**
 * 获取真实的配置信息对象
 * 该对象merge了DEFAULT_CONF
 * 
 * @ignore
 * @return {Object}
 */
function getActualConf() {
    var util = require( './util' );

    return util.extend( {}, DEFAULT_CONF, getConf() );
}

/**
 * 获取配置项的值
 * 
 * @param {string} name 配置项名称
 * @return {string}
 */
exports.get = function ( name ) {
    return getActualConf()[ name ];
};

/**
 * 设置配置项的值
 * 
 * @param {string} name 配置项名称
 * @param {string} value 配置项的值
 */
exports.set = function ( name, value ) {
    var conf = getConf();
    var util = require( './util' );

    conf[ name ] = value;
    fs.writeFileSync(
        RC_FILE, 
        util.stringifyJson( conf ),
        'UTF-8'
    );
};

/**
 * 检查user.name和user.email的配置，确保这两个东东存在.
 */
exports.checkEnv = function() {
    var pass = exports.get('user.name') && exports.get('user.email');

    var read = require('read');
    if (!exports.get('user.name')) {
        read({prompt: 'user.name> '}, function(er, name){
            exports.set('user.name', name);
            exports.checkEnv();
        });
    } else if (!exports.get('user.email')) {
        read({prompt: 'user.email> '}, function(er, name){
            exports.set('user.email', name);
            exports.checkEnv();
        });
    }

    return pass;
};


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
cli.command = 'config';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = ['list'];

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '读取和设置edp用户配置';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp config <name> [value]';

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 * @param {Object} opts 命令运行选项
 */
cli.main = function ( args, opts ) {
    if ( opts.list ) {
        var util = require( './util' );
        console.log( util.stringifyJson( getActualConf() ) );
        return;
    }

    var name = args[ 0 ];
    var value = args[ 1 ];

    if ( !value ) {
        console.log( exports.get( name ) );
    }
    else {
        exports.set( name, value );
        console.log( '"' + name + '" is setted.');
    }
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;


