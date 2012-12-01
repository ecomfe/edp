/**
 * @file edp控制中心
 * @author errorrik[errorrik@gmail.com]
 * @module lib/edp
 */

/**
 * edp版本信息
 *
 * @type {string}
 */
exports.version = '1.0.0';

/**
 * 模块运行处理器。该对象将被内建到context中，从而使module能控制运行时
 *
 * @ignore
 */
var processor = {
    /**
     * 包装模块运行入口的main函数
     *
     * @ignore
     * @param {function(commands,args)} mainFunc 模块运行的main函数
     * @return {function(...argv)}
     */
    packMain: function ( mainFunc ) {
        return function () {
            var args     = arguments;
            var argLen   = args.length;
            mainFunc( 
                Array.prototype.slice.call( args, 0, argLen - 1 ),
                args[ argLen - 1 ]
            );
        };
    }
};

/**
 * 现有模块集合
 *
 * @ignore
 * @type {Array}
 */
var modules = [];

/**
 * 添加模块
 *
 * @param {Object} module 运行模块
 */
exports.addModule = function ( module ) {
    modules.push( module );
};

/**
 * 运行环境对象
 *
 * @ignore
 * @type {Object}
 */
var context;

/**
 * edp初始化
 *
 * @param {Object} ctx 运行环境
 */
exports.init = function ( ctx ) {
    context = ctx;
    context.processor = processor;
    initBuiltinModule();
    initUserModule();
};

/**
 * 初始化模块
 *
 * @ignore
 * @param {Object} module
 */
function initModule( module ) {
    module.init( context );
}

/**
 * 初始化内建模块
 *
 * @ignore
 */
function initBuiltinModule() {
    for ( var i = 0; i < modules.length; i++ ) {
        var module = modules[ i ];
        initModule( module );
    }
}

/**
 * 初始化用户模块
 *
 * @ignore
 */
function initUserModule() {
    var fs = require( 'fs' );
    var path = process.env.HOME + '/edp_modules';

    if ( fs.existsSync( path ) && fs.statSync( path ).isDirectory() ) {
        var files = fs.readdirSync( path );

        files.forEach( 
            function ( file ) {
                file = path + '/' + file;
                
                if ( fs.statSync( file ).isFile() ) {
                    var module = require( file );
                    initModule( module );
                    exports.addModule( module );
                }
            } 
        );
    }
}

