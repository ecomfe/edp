/**
 * @file 路径映射的构建处理器
 * @author errorrik[errorrik@gmail.com]
 */

var util = require( '../../util' );

/**
 * 路径映射的构建处理器
 * 
 * @constructor
 * @param {Object} options 初始化参数
 * @param {string} options.from 原路径前缀片段
 * @param {string} options.to 替换的目标路径片段
 * @param {Array} options.replacements 需要替换的对象列表
 */
function PathMapper( options ) {
    this.replacements = options.replacements;
    this.from = new RegExp( '(^|/)' + options.from + '(/|$)' );
    this.to = function ( match, head, tail ) {
        return (head === '/' ? head : '') 
            + options.to
            + (tail === '/' ? tail : '');
    };
}

/**
 * 构建处理
 * 
 * @param {FileInfo} file 文件信息对象
 * @param {ProcessContext} processContext 构建环境对象
 * @param {Function} callback 处理完成回调函数
 */
PathMapper.prototype.process = function ( file, processContext, callback ) {
    var util = require( '../../util' );
    var builtinReplacers = this.replacers;
    var from = this.from;
    var to = this.to;

    /**
     * 值替换函数
     * 
     * @inner
     * @param {string} value 原始值
     * @return {string}
     */
    function valueReplacer( value ) {
        if ( !util.isLocalPath( value ) ) {
            return value;
        }

        return value.replace( from, to );
    }

    /**
     * 判断扩展名是否在允许范围内
     * 
     * @inner
     * @param {string} extname 扩展名
     * @param {string|Array} allows 允许的扩展名列表
     * @return {boolean}
     */
    function isExtnameAllow( extname, allows ) {
        var extnames = {};
        allows = allows || [];
        if ( !(allows instanceof Array) ) {
            allows = allows.split( /\s*,\s*/ );
        }
        allows.forEach(
            function ( allow ) {
                extnames[ allow ] = 1;
            }
        );

        return !!extnames[ extname ];
    }
    
    // 替换对象进行处理，替换文件内容
    // replacement替换有两种模式：
    // 1. 指定了type，使用固定逻辑替换
    // 2. 指定replacer，使用内置的replacer函数替换
    // 
    // 2的灵活性更强。
    // 
    // 1现在仅支持html tag的attribute替换
    // 2现在仅支持`module-config`替换
    // 1和2现在都是内置逻辑，原因是希望build配置是纯json。未来可能开放。
    this.replacements.forEach( 
        function ( replacement ) {
            if ( isExtnameAllow( file.extname, replacement.extnames ) ) {
                var data = file.data;
                var type = replacement.type;
                var replacer = replacement.replacer;

                if ( replacer ) {
                    data = builtinReplacers[ replacer ]( valueReplacer, data, file );
                }
                else {
                    if ( type === 'html' ) {
                        data = util.replaceTagAttribute(
                            data,
                            replacement.tag, 
                            replacement.attribute, 
                            valueReplacer
                        );
                    }
                }

                file.setData( data );
            }
        } 
    );

    // 替换文件路径
    file.outputPath = valueReplacer( file.outputPath );
    callback();
};

/**
 * 内置的替换方法
 * 
 * @namespace
 */
PathMapper.prototype.replacers = {
    /**
     * 模块配置路径替换
     * 
     * @param {function(string)} valueReplacer 值替换函数
     * @param {string} data 文件数据
     * @param {FileInfo} file 文件信息对象
     * @return {string}
     */
    'module-config': function ( valueReplacer, data, file ) {
        var confInfo = util.readLoaderConfig( data );
        if ( !confInfo ) {
            return data;
        }

        var confData = confInfo.data;

        confData.baseUrl = valueReplacer( confData.baseUrl );
        var paths = confData.paths || {};
        for ( var key in paths ) {
            path[ key ] = valueReplacer( path[ key ] );
        }

        var packages = confData.packages || [];
        for ( var i = 0; i < packages.length; i++ ) {
            var pkg = packages[ i ];
            if ( typeof pkg === 'object' && pkg.location ) {
                pkg.location = valueReplacer( pkg.location );
            }
        }

        return util.replaceLoaderConfig( confData, confInfo );
    }
};

module.exports = exports = PathMapper;
