
/**
 * 判断当前文件是否以命令行模式运行
 * 
 * @param {string} filename 文件路径
 * @return {boolean}
 */
exports.isRunFromCli = function ( file ) {
    return process.argv[ 1 ] === file;
};

/**
 * 解析命令行参数
 * 
 * @param {Array=} options 选项描述
 * @return {Object}
 */
exports.parseCliArgv = function ( options ) {
    options = options || [];
    var argv = process.argv.slice( 2 );

    var desc = {};
    options.forEach( function ( opt ) {
        if ( /:$/.test( opt ) ) {
            desc[ opt.replace( /:$/, '' ) ] = 2;
        }
        else {
            desc[ opt ] = 1;
        }
    } );

    var data = { args: [], options: {} };
    for ( var i = 0; i < argv.length; i++ ) {
        var arg = argv[ i ];
        if ( /^--?([-A-Z0-9]+)(=([^=]+))?$/i.test( arg ) ) {
            var name = RegExp.$1;
            var value = RegExp.$3;
            switch ( desc[ name ] ) {
                case 1:
                    data.options[ name ] = true;
                    break;
                case 2:
                    data.options[ name ] = value || argv[ ++i ];
                    break;
            }
        }
        else {
            data.args.push( arg );
        }
    }

    return data;
};
