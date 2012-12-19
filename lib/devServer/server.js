/**
 * @file 开发时web调试服务器启动
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com]
 * @module lib/devServer/server
 */

var util = require( './util' );
var res = require( './res' );

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

/**
 * 获取请求的处理函数
 * 
 * @inner
 * @param {http.ServerRequest} request request
 * @return {function(http.ServerRequest, http.ServerResponse)}
 */
function findHandler( request ) {
    var url = request.url;
    var locations = serverConf 
        && serverConf.getLocations
        && serverConf.getLocations();

    if ( locations instanceof Array ) {
        for ( var i = 0, len = locations.length; i < len; i++ ) {
            var item = locations[ i ];
            var location = item.location;

            // location support:
            // 1. string
            // 2. RegExp which use test
            // 3. function which return true or false
            if ( 
                ( location instanceof RegExp && location.test( url ) )
                || ( typeof location == 'string' && location == url )
                || ( typeof location == 'function' && location( request ) )
            ) {
                return item.handler;
            }
        }
    }

    return null;
}

/**
 * http server的request 监听函数
 * 
 * @inner
 * @param {http.ServerRequest} request request
 * @param {http.ServerResponse} response response
 */
function httpHandler( request, response ) {
    var url = require( 'url' );
    util.extend( request, url.parse( request.url, true ) );

    var handler = findHandler( request );
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

                // init handler context
                var isEnd = false;
                var isWait = false;
                var context = {
                    request  : request,
                    response : response,
                    conf     : serverConf,
                    status   : 200,
                    content  : '',
                    header   : {},
                    end: function () {
                        isEnd = true;
                        response.end();
                    },
                    stop: function () {
                        isWait = true;
                    },
                    start: function () {
                        isWait = false;
                        nextHandler();
                    }
                };

                // init handlers
                var handlers = [];
                if ( typeof handler == 'function' ) {
                    handlers.push( handler );
                }
                else if ( handler instanceof Array ) {
                    handlers.push.apply( handlers, handler );
                }
                handlers.push( res.write() );
                
                // handle
                var index = -1;
                var length = handlers.length;
                nextHandler();
                function nextHandler() {
                    if ( isWait ) {
                        return;
                    }

                    index++;
                    if ( index < length ) {
                        handlers[ index ]( context );
                        nextHandler();
                    }
                }
            }
        );
    }
    else {
        response.writeHeader( 404 );
        response.end();
    }
}

