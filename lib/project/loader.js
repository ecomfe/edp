

var project = require( '../project' );
var util = require( '../util' );
var fs = require( 'fs' );
var path = require( 'path' );
var semver = require( 'semver' );
var esprima = require( 'esprima' );
var escodegen = require( 'escodegen' );


// TODO: package的多版本并存处理


/**
 * 获取文件的loader config信息
 * 
 * @param {string} file 文件路径
 * @return {Object}
 */
exports.getData = function ( file ) {
    var dir = path.dirname( file );
    var manifest = project.getManifest( dir );

    if ( !manifest ) {
        return null;
    }

    // 获取处理所需的相关信息
    var wwwroot = manifest.wwwroot;
    var fileMetadata = {};
    try {
        util.getFileMetadata( file );
    } 
    catch (ex) {}

    // 计算相对于wwwroot的路径：
    // 1. 文件声明webpath的metadata时，为webpath to wwwroot的路径
    // 2. 文件未声明webpath的metadata时，为filepath to projectDir的路径
    var webpath = fileMetadata.webpath;
    var relativePath = webpath
        ? path.relative( webpath.replace( /\/$/, '/term' ), wwwroot )
            .replace( /^\.\./, '.' )
            .replace( /^\.\//, '' )
        : path.relative( file, project.findDir( dir ) )
            .replace( /^\.\./, '.' )
            .replace( /^\.\//, '' );

    // 初始化信息数据
    var data = {
        url: manifest.loaderUrl,
        baseUrl: relativePath + '/' + manifest.loaderBaseUrl,
        paths: {},
        packages: []
    };
    
    // 计算paths配置
    var paths = manifest.loaderPaths;
    for ( var key in paths ) {
        data.paths[ key ] = relativePath + '/' + paths[ key ];
    }

    // 计算packages配置
    var packages = require( '../import' ).getExists( dir );
    for ( var key in packages ) {
        var pkg = packages[ key ];
        var defaultVersion = Object.keys( pkg ).sort( semver.rcompare )[ 0 ];

        // TODO: read package.json main
        data.packages.push({
            name: key,
            location: relativePath + '/' + manifest.libDir + '/' + key + '/' + defaultVersion + '/src',
            main: 'main'
        });
    }

    return data;
};

/**
 * 更新文件的config
 * 
 * @inner
 * @param {string} file 文件路径
 * @param {string=} encoding 文件编码
 */
function updateFileConfig( file, encoding ) {
    encoding = encoding || 'UTF-8';
    var output = util.readLoaderConfig( file, encoding );
    var content = output.fileContent;

    var projectData = exports.getData( file );
    var configData = output.data;

    configData.paths = projectData.paths;
    configData.packages = projectData.packages;
    configData.baseUrl = projectData.baseUrl;

    var code = escodegen.generate(
        esprima.parse( '(' + JSON.stringify( configData ) + ')' ),
        {
            format: {
                escapeless:true,
                indent: {
                    style: '    ',
                    base: output.indentBase
                }
            }      
        }
    );

    fs.writeFileSync( 
        file,
        content.slice( 0, output.fromIndex ) 
            + code.replace( /(^\s*\(|\);$)/g, '' ) 
            + content.slice( output.toIndex ),
        encoding 
    );
}

/**
 * 扫瞄目录并更新文件
 * 
 * @inner
 * @param {string} dir 目录名
 * @param {RegExp} extnameRule 文件扩展名匹配的正则
 */
function scanAndUpdate( dir, extnameRule ) {
    fs.readdirSync( dir ).forEach( 
        function ( file ) {
            if ( file === 'lib' || file.indexOf( '.' ) === 0 ) {
                return;
            }

            var fullPath = path.resolve( dir, file );
            var stat = fs.statSync( fullPath );
            if ( stat.isDirectory() ) {
                scanAndUpdate( fullPath, extnameRule );
            }
            else if ( stat.isFile() 
                && extnameRule.test( path.extname( file ) ) 
            ) {
                updateFileConfig( fullPath );
            }
        }
    );
}

/**
 * 更新loader配置信息
 */
exports.updateConfig = function () {
    var projDir = project.findDir();
    var extnames = (project.getManifest() || {}).loaderAutoConfig;

    if ( projDir && extnames ) {
        scanAndUpdate( 
            projDir, 
            new RegExp( '\\.(' + extnames.replace( /,/g, '|' ) + ')$' )
        );
    }
};

