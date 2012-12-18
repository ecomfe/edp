/**
 * @file 内建资源处理方法集合
 * @author otakustay[otakustay@live.com], 
 *         errorrik[errorrik@gmail.com]
 * @module lib/devServer/res
 */

var fs          = require( 'fs' );
var path        = require( 'path' );
var util        = require( './util' );
var mimeType    = require( './mimeType' );

function getContentType( pathname, specified ) {
    if ( specified ) {
        return specified;
    }

    var extension = path.extname( pathname );
    return mimeType[ extension ];
};

function writeHeader( response, status, contentType, headers ) {
    response.writeHeader(
        status, 
        util.mix( headers, { 'Content-Type': contentType } )
    );
}

exports.file = function( filename, userContentType, headers ) {
    return function( request, response ) {
        var file = filename || '.' + request.pathname.slice( 1 );
        var extension = path.extname( file );
        var contentType = userContentType || mimeType[ extension.slice( 1 ) ];

        path.exists( file, function ( exists ) {
            if ( exists ) {
                fs.readFile( file, function ( error, data ) {
                    if ( error ) {
                        writeHeader(
                            response, 
                            500, 
                            getContentType( request.pathname, contentType ), 
                            headers
                        );
                        response.end();
                    }
                    else {
                        writeHeader(
                            response, 
                            200, 
                            getContentType( request.pathname, contentType ), 
                            headers
                        );
                        response.end(data);
                    }
                });
            }
            else {
                writeHeader(
                    response, 
                    404, 
                    getContentType( request.pathname, contentType ), 
                    headers
                );
            }
        });
    };
};

exports.status = function( status, content, contentType, headers ) {
    return function ( request, response ) {
        writeHeader(
            response, 
            status, 
            getContentType( request.pathname, contentType ), 
            headers
        );

        response.end( content );
    };
};

exports.json = function ( data, headers ) {
    return function ( request, response ) {
        writeHeader( response, 200, mimeType.json, headers );
        response.end( JSON.stringify( data ) );
    };
};

exports.jsonp = function ( data, callbackKey, headers ) {
    callbackKey = callbackKey || 'callback';

    return function ( request, response ) {
        var qs = require( 'querystring' );
        var query = qs.parse( request.search );
        var fnName = query[ callbackKey ];

        writeHeader( response, 200, mimeType.js, headers );
        response.end( fnName + '(' + JSON.stringify( data ) + ');' );
    };
};

exports.dumpRequest = function() {
    return function(request, response) {
        var result = {
            url         : request.url,
            method      : request.method,
            httpVersion : request.httpVersion,
            protocol    : request.protocol,
            host        : request.host,
            auth        : request.auth,
            hostname    : request.hostname,
            port        : request.port,
            search      : request.search,
            hash        : request.hash,
            headers     : request.headers,
            query       : request.query,
            body        : request.body
        };

        writeHeader(response, 200, 'application/json');
        response.end(JSON.stringify(result, null, '    '));
    };
};

exports.delay = function ( time, actual ) {
    return function ( request, response ) {
        setTimeout(
            function() { 
                actual(request, response); 
            },
            time
        );
    }
};

// 复用
exports.content = function ( content, contentType, headers ) {
    return exports.status( 200, content, contentType, headers );
};

exports.redirect = function ( location, permanent, headers ) {
    return exports.status(
        permanent ? 301 : 302,
        '',
        defaultMimeType,
        util.mix( headers, { 'Location': location } )
    );
};

exports.empty = function () {
    return exports.content( '' );
};

