/**
 * @file package主脚本
 * @author errorrik[errorrik@gmail.com]
 */


var edp = require( './lib/edp' );

/**
 * 内建模块
 *
 * @const
 * @type {Array}
 */
var BUILT_IN = [
    'config'
];

// 装载内建模块
var modules = [];
for ( var i = 0; i < BUILT_IN.length; i++ ) {
    var moduleName = BUILT_IN[ i ];
    edp.addModule(
        require( './lib/' + moduleName )
    );
}

module.exports = edp;
