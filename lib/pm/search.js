/**
 * @file 包查询功能
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 对registry返回的数据进行过滤和适配
 * 
 * @inner
 * @param {Object} data 数据
 * @param {string=} keyword 过滤关键字
 * @return {Array}
 */
function dataAdapter( data, keyword ) {
    keyword = keyword || '';

    return Object.keys( data )
        .map( function ( key ) {
            return data[ key ];
        } )
        .filter( function ( item ) {
            return typeof item === 'object';
        } )
        .map( function ( item ) {
            var data = {
                name: item.name,
                description: item.description || '',
                keywords: item.keywords || [],
                versions: Object.keys( item.versions ) || [],
                maintainers: item.maintainers || []
            };

            data._word = data.name.toLowerCase() + ' ' 
                + data.description.toLowerCase();

            var time = item.time && item.time.modified;
            if ( time ) {
                data.time = new Date(time).toISOString()
                     .split( 'T' ).join( ' ' )
                     .replace( /:[0-9]{2}\.[0-9]{3}Z$/, '' );
            }
            return data;
        } )
        .filter( function ( item ) {
            return item._word.indexOf( keyword.toLowerCase() ) !== -1;
        } );
}

/**
 * 包查询
 * 
 * @param {string=} keyword 查询关键字
 * @param {function} callback 回调函数
 */
function search( keyword, callback ) {
    var registry = require( '../pm' ).getRegistry();
    registry.get( 
        '/-/all', 
        1000,
        false,
        true,
        function ( error, data ) {
            if ( error ) {
                console.log( errpr );
                return; 
            }
            
            callback( error, dataAdapter( data, keyword ) );
        }
    );
}

module.exports = exports = search;


