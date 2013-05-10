/**
 * @file 包查询功能
 * @author errorrik[errorrik@gmail.com]
 */

 var edpconf = require("./../config.js");
 
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
                versions: Object.keys( item.versions )|| [],
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
 * 构造可打印的美化数据
 * 
 * @param {Object} data 包数据
 * @param {string} keyword 关键字
 * @return {string} 可打印的美化数据
 */
function prettify (data, keyword) {
    try {
        var tty = require("tty");
        var stdout = process.stdout;
        var cols = !tty.isatty(stdout.fd) ? Infinity
                 : stdout._handle ? stdout._handle.getWindowSize()[0]
                 : process.stdout.getWindowSize()[0];
        cols = (cols == 0) ? Infinity : cols;
    } catch (ex) { 
        cols = Infinity; 
    }
    var longest = [];
    var spaces;
    var maxLen = edpconf.get("description")
             ? [20, 60, 20, 20, 20, Infinity]
             : [20, 20, 20, 20, Infinity];
    
    var headings = ["NAME", "DESCRIPTION", "AUTHOR", "VERSIONS", "DATE", "KEYWORDS"];
    var lines;
    var searchsort = (edpconf.get("searchsort") || "NAME").toLowerCase();
    var sortFields = {
        name: 0,
        description: 1,
        author: 2,
        versions: 3,
        date: 4,
        keywords: 5 
    };
    var searchRev = searchsort.charAt(0) === "-";
    var sortField = sortFields[searchsort.replace(/^\-+/, "")];

    lines = Object.keys(data).map(function (d) {
        return data[d]
    }).map(function (data) {
        if (typeof data.keywords === "string") {
            data.keywords = data.keywords.split(/[,\s]+/);
        }
        if (!Array.isArray(data.keywords)) data.keywords = [];
        var arr = [
            data.name,
            data.description || "",
            data.maintainers.join(" "),
            (data.versions || []).join('&'),
            data.time,
            (data.keywords || []).join(" ")
        ];
        arr.forEach(function (s, i) {
            var len = s.length;
            longest[i] = Math.min(maxLen[i] || Infinity, Math.max(longest[i] || 0, len));
            if (len > longest[i]) {
                arr._undent = arr._undent || [];
                arr._undent[i] = len - longest[i];
            }
            arr[i] = ('' + arr[i]).replace(/\s+/g, " ");
        })
        return arr;
    }).sort(function (a, b) {
        var aa = a[sortField].toLowerCase();
        var bb = b[sortField].toLowerCase();
        return aa === bb ? 0
             : aa < bb ? (searchRev ? 1 : -1)
             : (searchRev ? -1 : 1);
    }).map(function (line) {
        return line.map(function (s, i) {
            spaces = spaces || longest.map(function (n) {
                if(n > 0){
                    return new Array(n + 2).join(" ")
                }else{
                    return "";
                }
            })
            var len = s.length
            if (line._undent && line._undent[i - 1]) {
                len += line._undent[i - 1] - 1;
            }
            if(s.length){
                return s + spaces[i].substr(len) + "    ";
            }else{
                return s + spaces[i].substr(len);
            }
            
        }).join("").substr(0, cols).trim();
    }).map(function (line) {
        return line.trim();
    })

    if (lines.length === 0) {
        return "No match found for " + (keyword);
    }
    return "\n" + headings.map(function (h, i) {
        var space = Math.max(2, 6 + (longest[i] || 0) - h.length);
        if(longest[i]){
            return h + (new Array(space).join(" "));
        }else{
            return "";
        }
    }).join("").substr(0, cols).trim() + "\n" + lines.join("\n")+ "\n\n";
}

/**
 * 结构化源数据
 * 
 * @param {Object} data 包数据
 * @return {Object} 结构化后的源数据
 */
function stripData (data) {
  return {
        name: data.name,
        description: edpconf.get("description") ? data.description : "",
        maintainers: (data.maintainers || []).map(function (m) {
         return m.name
        }),
        url: !Object.keys(data.versions || {}).length ? data.url : null,
        keywords: data.keywords || [],
        time: data.time
            && data.time.modified
            && (new Date(data.time.modified).toISOString()
                .split("T").join(" ")
                .replace(/:[0-9]{2}\.[0-9]{3}Z$/, ""))
            || "(prehistoric)"
    };
}
/**
 * 构造用于匹配的源数据
 * 
 * @param {Object} data 包数据
 * @return {string} 源数据
 */
function getWords (data) {
    data.words = [ data.name ]
               .concat(data.description)
               .concat(data.maintainers)
               .concat(data.url && ("<" + data.url + ">"))
               .concat(data.keywords)
               .map(function (f) { return f && f.trim && f.trim() })
               .filter(function (f) { return f })
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
function match (data, keyword) {
    return data.indexOf(keyword) !== -1;
}
/**
 * 按关键字过滤数据
 * 
 * @param {Object} data 包数据
 * @param {string} keyword 关键词
 * @return {boolean} false/true是否过滤
 */
function filterKeyWord (data, keyword) {
    var words = data.words;
    if (!match(words, keyword)){ 
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
function filterData (data, keyword) {
    // data={<name>:{package data}}
    return Object.keys(data).map(function (d) {
        return data[d]
    }).filter(function (d) {
        return typeof d === "object"
    }).map(stripData).map(getWords).filter(function (data) {
        return filterKeyWord(data, keyword);
    }).reduce(function (l, r) {
        l[r.name] = r
        return l
    }, {});
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
            var filter_Data = filterData(data, keyword);
            console.log(prettify(filter_Data, keyword));
            callback(error, filter_Data);
            //callback( error, dataAdapter( data, keyword ) );
        }
    );
}

module.exports = exports = search;


