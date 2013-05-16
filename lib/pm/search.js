/**
 * @file 包查询功能
 * @author errorrik[errorrik@gmail.com] fanxueliang[fanxueliang@baidu.com]
 */

var edpconf = require("../config.js");

/**
 * 构造可打印的美化数据
 * 
 * @param {Object} data 包数据
 * @param {string} keyword 关键字
 * @return {string} 可打印的美化数据
 */
function prettify ( data, keyword ) {
    try {
        var tty = require( "tty" );
        var stdout = process.stdout;
        var cols = !tty.isatty( stdout.fd ) ? Infinity
            : stdout._handle ? stdout._handle.getWindowSize()[0]
            : process.stdout.getWindowSize()[0];
        cols = ( cols == 0 ) ? Infinity : cols;
    } catch ( ex ) { 
        cols = Infinity; 
    }
    var longest = [];
    var maxLen = [20, 20, 40, 20, 80, 60, Infinity];
    
    var headings = [ "NAME", "AUTHOR", "VERSIONS", "DATE", "URL", "KEYWORDS", "DESCRIPTION" ];
    var lines;
    var searchsort = ( edpconf.get("searchsort") || "NAME" ).toLowerCase();
    var sortFields = {
        name: 0,
        author: 1,
        versions: 2,
        date: 3,
        url: 5,
        keywords: 6,
        description: 4,
    };
    var searchRev = searchsort.charAt(0) === "-";
    var sortField = sortFields[ searchsort.replace(/^\-+/, "") ];

    lines = Object.keys( data ).map(
            function (item) {
                return data[item];
            }
        ).map(
            function ( data ) {
                if (typeof data.keywords === "string") {
                    data.keywords = data.keywords.split(/[,\s]+/);
                }
                if ( !Array.isArray( data.keywords ) ) {
                    data.keywords = [];
                }
                var lineArr = [
                    data.name,
                    data.maintainers.join(" "),
                    (data.versions || []).join('&'),
                    data.time,
                    data.url,
                    (data.keywords || []).join(" "),
                    data.description || ""
                ];
                lineArr.forEach(
                    function ( item, index ) {
                        var len = item.length;
                        longest[index] = Math.min( 
                            maxLen[index] || Infinity,
                            Math.max( longest[index] || 0, len )
                        );
                        if ( len > longest[index] ) {
                            lineArr._undent = lineArr._undent || [];
                            lineArr._undent[index] = len - longest[index];
                        }
                        lineArr[index] = ( '' + lineArr[index] ).replace( /\s+/g, " " );
                    }
                )
                return lineArr;
            }
        ).sort(
            function ( a, b ) {
                var aa = a[sortField].toLowerCase();
                var bb = b[sortField].toLowerCase();
                return aa === bb ? 0
                    : aa < bb ? ( searchRev ? 1 : -1 )
                    : ( searchRev ? -1 : 1 );
            }
        ).map(
            function ( line ) {
                var lineArr = line.map(
                    function ( item, index ) {
                        var spaces = longest.map(
                            function ( n ) {
                                if( n > 0 ){
                                    return new Array( n + 2 ).join(" ")
                                }else{
                                    return "";
                                }
                            }
                        )
                        var len = item.length
                        if ( line._undent && line._undent[index - 1] ) {
                            len += line._undent[index - 1] - 1;
                        }
                        if( item.length ){
                            return item + spaces[index].substr( len );
                        }else{
                            return item + spaces[index].substr( len );
                        }
                        
                    }
                )
                return lineArr.join("    ").substr(0, cols).trim();
            }
        ).map(
            function ( line ) {
                return line.trim();
            }
        );

    if ( lines.length === 0 ) {
        return "No match found for " + ( keyword );
    }
    var linesStr =  "\n" + headings.map(
        function ( item, index ) {
            var space = Math.max( 2, 6 + ( longest[index] || 0 ) - item.length );
            if( longest[index] ){
                return item + (new Array( space ).join(" "));
            }else{
                return "    ";
            }
        }
    ).join("").substr(0, cols).trim() + "\n\n" + lines.join("\n")+ "\n";
    return linesStr;
}

/**
 * 结构化源数据
 * 
 * @param {Object} data 包数据
 * @return {Object} 结构化后的源数据
 */
function stripData ( data ) {
    var result = {
        name: data.name,
        description: data.description || '',
        maintainers: ( data.maintainers || [] ).map(
            function ( item ) {
                return item.name;
            }
        ),
        url: ( data.repository && data.repository.url ) || '',
        versions: Object.keys( data.versions || {} ).length 
            ? Object.keys( data.versions || {} ) : [],
        keywords: data.keywords || [],
        time: data.time && data.time.modified
            && (new Date(data.time.modified).toISOString()
                .split("T").join(" ")
                .replace(/:[0-9]{2}\.[0-9]{3}Z$/, ""))
            || "(prehistoric)"
    };
    return result;
    
}

/**
 * 构造用于匹配的源数据
 * 
 * @param {Object} data 包数据
 * @return {string} 源数据
 */
function getWords (data) {
    data.words = [ data.name ]
        .concat( data.description )
        .concat( data.maintainers )
        .concat( data.url && ( "<" + data.url + ">" ) )
        .concat( data.keywords )
        .map(
            function ( f ) { 
                return f && f.trim && f.trim();
            }
        )
        .filter(
            function (f) { 
                return f;
            }
        )
        .join("")
        .toLowerCase();
    return data;
}

/**
 * 按关键字匹配数据
 * 
 * @param {string} data 源数据
 * @param {string} keyword 匹配数据
 * @return {boolean} true/false是否匹配
 */
function match ( data, keyword ) {
    if( data && keyword ){
        return data.indexOf( keyword ) !== -1;
    }else{
        return false;
    }
}

/**
 * 按关键字过滤数据
 * 
 * @param {Object} data 包数据
 * @param {string} keyword 关键词
 * @return {boolean} false/true是否过滤
 */
function filterKeyWord ( data, keyword ) {
    var words = data.words;
    if ( !match( words, keyword ) ){ 
        return false;
    }else{
        return true;
    }
}

/**
 * 结构化并过滤源数据
 * 
 * @param {Object} data 包数据
 * @param {string} keyword 关键字
 * @return {Object} 结构化后的数据
 */
function filterData ( data, keyword ) {
    var result = Object.keys( data ).map(
            function ( item ) {
                return data[item];
            }
        ).filter( 
            function ( item ) {
                return typeof item === "object";
            }
        ).map( stripData ).map( getWords ).filter(
            function (item) {
                return filterKeyWord( item, keyword );
            }
        ).reduce( 
            function ( data, item ) {
                data[item.name] = item;
                return data;
            },
            {}
        );
    return result;
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
                console.log( error );
                return; 
            }
            var resultData = filterData( data, keyword );
            console.log( prettify( resultData, keyword ) );
            callback( error, resultData );
        }
    );
}

module.exports = exports = search;


