/**
 * @file 开发时web调试服务器启动
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com]
 * @module lib/devServer/server
 */

var util = require( './util' );

/**
 * 服务器配置
 * 
 * @inner
 */
var serverConf;

/**
 * 启动服务器
 *
 * @param {Object} conf 启动所需配置信息
 */
exports.start = function ( conf ) {
    serverConf = conf;

    var port = conf.port || 80;
    var http = require( 'http' );
    var server = http.createServer( httpHandler );
    server.listen( port );

    console.log( 'DevServer start, listen ' + port );
};


function findHandler( url ) {
    var locations = serverConf && serverConf.locations;

    if ( locations instanceof Array ) {
        for ( var i = 0, len = locations.length; i < len; i++ ) {
            var item = locations[ i ];
            var location = item.location;

            if ( 
                ( location instanceof RegExp && location.test( url ) 
                || ( typeof location == 'string' && location == url )
            ) {
                return item.handler;
            }
        }
    }

    return null;
}

function httpHandler( request, response ) {
    var url = require( 'url' );
    var urlStr = request.url;
    var handler = findHandler( urlStr );
    util.extend( request, url.parse( urlStr, true ) );

    if ( handler ) {
        var bodyBuffer = [];

        request.on( 
            'data', 
            function ( chunk ) { 
                bodyBuffer.push( chunk ); 
            }
        );

        request.on( 
            'end', 
            function () { 
                if ( bodyBuffer.length > 0 ) {
                    request.bodyBuffer = Buffer.concat( bodyBuffer );
                }
                handler( request, response );
            }
        );
    }
    else {
        response.writeHeader( 404 );
        response.end();
    }
}

