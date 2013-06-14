/**
 * @file 包获取功能
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 创建request
 * 
 * @inner
 * @param {string} url 远程包URL
 * @return {HttpRequest}
 */
function createRequest( url ) {
    url = require( 'url' ).parse( url );
    
    var opt = {
        url: url,
        strictSSL: false,
        rejectUnauthorized: false,
        headers: { 'user-agent': 'edp/' + require( '../edp' ).version }
    };

    return require( 'request' )( opt );
}

/**
 * 检查package tar包的sha
 * 
 * @inner
 * @param {string} file tar包文件
 * @param {string} sha sha值
 * @param {function({Error}error)} callback 回调函数
 */
function checkSha( file, sha, callback ) {
    sha = sha.toLowerCase();
    var crypto = require( 'crypto' );
    var hash = crypto.createHash( 'sha1' );

    var stream = require( 'fs' ).createReadStream( file );
    stream
        .on( 'data', function ( chunk ) {
            hash.update( chunk );
        })
        .on( 'end', function () {
            var actual = hash.digest( 'hex' ).toLowerCase().trim();
            var error = sha === actual 
                ? null 
                : new Error( '[shasum]expect ' + sha1 + ', actual ' + actual );
            callback( error );
        })
        .on( 'error', function ( error ) {
            callback( error );
        });
}

/**
 * 获取包
 * 
 * @param {string} name 包名称
 * @param {string} toDir 要放到的目录下
 * @param {Function} callback 回调函数
 */
function fetch( name, toDir, callback ) {
    callback = callback || function () {};

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
                callback( error, data );
                return;
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
                    var shasum = data.dist.shasum;
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
                        checkSha( fullPath, shasum, function ( error ) {
                            callback( error, {
                                file: file,
                                path: fullPath,
                                version: ver,
                                name: name,
                                shasum: shasum
                            } );
                        } );
                    } );
                }
            );
        }
    );
}


module.exports = exports = fetch;


