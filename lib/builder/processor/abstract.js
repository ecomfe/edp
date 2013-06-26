/**
 * @file 构建处理器抽象类
 * @author errorrik[errorrik@gmail.com]
 */

var util = require( '../../util' );


/**
 * 构建处理器抽象类
 * 
 * @abstract
 * @constructor
 * @param {Object} options 初始化参数
 */
function AbstractProcessor( options ) {
    util.extend( this, options );
}

/**
 * 判断处理器是否忽略文件
 * 
 * @param {FileInfo} file 文件信息对象
 */
AbstractProcessor.prototype.isExclude = function ( file ) {
    var satisfy = false;
    var excludes = this.exclude instanceof Array
        ? this.exclude
        : [];

    excludes.forEach( 
        function ( path ) {
            satisfy = satisfy || util.pathSatisfy( file.path, path, file.stat );
        }
    );

    return satisfy;
};

/**
 * 构建处理
 * 
 * @virtual
 * @param {FileInfo} file 文件信息对象
 * @param {ProcessContext} processContext 构建环境对象
 * @param {Function} callback 处理完成回调函数
 */
AbstractProcessor.prototype.process = function ( 
    file, 
    processContext, 
    callback 
) {
    // do nothing in abstract class
    callback();
};

module.exports = exports = AbstractProcessor;
