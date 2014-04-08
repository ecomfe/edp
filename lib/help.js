/**
 * @file 命令信息提示帮助模块
 *
 * @author leeight[liyubei@baidu.com]
 *         errorrik[errorrik@gmail.com]
 */
var edp = require( 'edp-core' );
var path = require( 'path' );
var fs = require( 'fs' );
var cmd = require( './cmd' );

function getPackages( pattern, dir ) {
    dir = dir || path.join( __dirname, '..', 'node_modules' );

    var pkgs = fs.readdirSync( dir )
                 .filter( function( item ){
                     return pattern.test( item );
                 });

    return pkgs;
}

/**
 * 获取内置的命令列表
 *
 * @param {string=} dir 需要查询的目录.
 * @return {Array.<CommandNode>}
 */
exports.getBuiltinCommands = function( dir ) {
    var pkgs = getPackages( /^edp-/, dir );

    // 扫描每个node_modules/pkg，获取提供的commands.
    var builtinCommands = [];
    pkgs.forEach( function( pkg ) {
        var pkgCommands = cmd.getPackageCommands( pkg );
        for ( var key in pkgCommands ) {
            builtinCommands.push( pkgCommands[ key ] );
        }
    });

    return builtinCommands;
};

/**
 * 获取扩展的命令列表
 *
 * @param {string=} dir 需要查询的目录.
 * @return {Array.<CommandNode>}
 */
exports.getUserCommands = function( dir ) {
    var pkgs = getPackages( /^edpx-/, dir );

    var userCommands = [];
    pkgs.forEach( function( pkg ) {
        var pkgCommands = cmd.getPackageCommands( pkg );
        for ( var key in pkgCommands ) {
            userCommands.push( pkgCommands[ key ] );
        }
    });

    return userCommands;
};


/**
 * 显示默认的帮助信息.
 */
exports.defaultInfo = function() {
    var builtinCommands = exports.getBuiltinCommands();

    // 输出builtinCommands和userCommands的内容
    console.log( 'Builtin Commands:' );
    displayHelpInfo( builtinCommands );

    var userCommands = exports.getUserCommands();
    if ( userCommands.length ) {
        console.log( '\nUser Commands:' );
        displayHelpInfo( userCommands );
    }
};

/**
 * 显示多命令的描述信息
 *
 * @param {Array.<CommandNode>} commands 命令集合
 */
function displayHelpInfo( commands ) {
    commands.forEach( function( cmd ) {
        exports.displayCommandDescription( cmd );
    });
}

/**
 * 显示命令的描述信息
 *
 * @param {CommandNode} node command节点的实例
 * @param {number=} level 显示层级
 */
exports.displayCommandDescription = function ( node, level ) {
    level = level || 0;
    var prefixWhiteLetter = '  ';
    if ( level > 0 ) {
        prefixWhiteLetter += (new Array( level )).join( '    ' ) + ' |- ';
    }
    var sprintf = require( 'sprintf' ).sprintf;

    if ( node ) {
        var module = node.module;
        var cli = module.cli;

        var isProxy = ( module.proxy === true );
        var isValid = ( cli && cli.main );

        if ( isProxy || isValid ) {
            console.log( prefixWhiteLetter
                + sprintf( '%-20s %s', edp.util.colorize( cli.command, 'success' ),
                    cli.description || '' )
            );

            var childLevel = level + 1;
            for ( var key in node.children ) {
                exports.displayCommandDescription(
                    node.children[ key ],
                    childLevel
                );
            }
        }
    }
};

/**
 * 显示command的帮助信息.
 *
 * @param {CommandNode} node command节点的实例
 */
exports.displayCommandHelp = function( node ) {
    var msee = require( 'msee' );
    var docFile = node.fullPath.replace( /\.js$/, '.md' );

    if ( fs.existsSync( docFile ) ) {
        var docText = msee.parseFile( docFile );
        console.log( docText );
    }
    else {
        var cli = node.module.cli;
        var docText = msee.parse(
            cli.command + '\n' +
            '---------\n' +
            '### Description\n\n' +
            cli.description || 'There is nothing left here.'
        );
        console.log( docText );
    }
};

/**
 * 打印已经安装的各个模块的信息
 */
exports.dumpVersion = function() {
    console.log( 'edp version ' + require('./edp').version );

    function getVersion( pkg ) {
        var config = path.join( __dirname, '..', 'node_modules', pkg, 'package.json' );
        if ( fs.existsSync( config ) ) {
            config = JSON.parse( fs.readFileSync( config, 'utf-8' ) );
        }
        else {
            config = { version: '0.0.0' };
        }

        return '  ' + edp.util.colorize( pkg, 'success' ) + ' (' + config.version + ')';
    }

    var builtinPackages = getPackages( /^edp-/ ).map( getVersion );
    var userPackages = getPackages( /^edpx-/ ).map( getVersion );
    console.log( 'Builtin Commands:' );
    console.log( builtinPackages.join( '\n' ) );

    if ( userPackages.length ) {
        console.log( '\nUser Commands:' );
        console.log( userPackages.join( '\n' ) );
    }
};




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
