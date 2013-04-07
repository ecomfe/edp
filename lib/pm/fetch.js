/**
 * @file 包获取功能
 * @author errorrik[errorrik@gmail.com]
 * @module lib/pm/fetch
 */

/**
 * 创建request
 * 
 * @inner
 * @param {string} url 远程包URL
 * @return {HttpRequest}
 */
function createRequest( url ) {
    var urlUtil = require( 'url' );
    url = urlUtil.parse( url );
    var host = urlUtil.parse( require( '../pm' ).getRegistryUrl() );
    var opt = {
        url: url,
        strictSSL: false,
        rejectUnauthorized: false,
        headers: { 'user-agent': 'edp/1.0.0' }
    };

    return require( 'request' )( opt );
}

/**
 * 获取包
 * 
 * @param {string} name 包名称
 * @param {string} toDir 要放到的目录下
 * @param {Function} callback 回调函数
 */
function fetch( name, toDir, callback ) {
    var part = name.split( '@' );
    name = part[ 0 ];
    var version = part[ 1 ];

    var mkdir = require( 'mkdirp' );
    mkdir.sync( toDir );

    var registry = require( '../pm' ).getRegistry();
    registry.get(
        name,
        function ( error, data ) {
            if ( error ) {
                throw error;
            }

            var versions = Object.keys( data.versions || {} );
            var ver = require( 'semver' ).maxSatisfying( versions, version );

            if ( !ver ) {
                console.log( 'No matched version!' );
                return;
            }

            registry.get( 
                name + '/' + ver,
                function ( error, data ) {
                    if ( error ) {
                        throw error;
                    }

                    var fs = require( 'fs' );
                    var path = require( 'path' );

                    var tarball = data.dist.tarball;
                    var file = tarball.slice( tarball.lastIndexOf( '/' ) + 1 );
                    var fullPath = path.resolve( toDir, './' + file );

                    var stream = fs.createWriteStream( fullPath );
                    var request = createRequest( tarball );
                    request.on( 'error', function ( error ) {
                        stream.emit( 'error', error );
                    } );
                    request.pipe( stream );

                    var response;
                    request.on( 'response', function ( res ) {
                        response = res;
                        response.resume();
                    } );

                    stream.on( 'close', function () {
                        callback && callback( {
                            file: file,
                            path: fullPath,
                            version: ver,
                            name: name
                        } );
                    } );
                }
            );
        }
    );
}


module.exports = exports = fetch;


