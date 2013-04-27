
/**
 * 判断当前文件是否以命令行模式运行
 * 
 * @param {string} filename 文件路径
 * @return {boolean}
 */
exports.isRunFromCli = function ( file ) {
    return process.argv[ 1 ] === file;
};