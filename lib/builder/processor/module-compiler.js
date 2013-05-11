function ModuleCompiler( options ) {
    this.configFile = options.configFile;
}

var util = require( '../util' );
var path = require( 'path' );

ModuleCompiler.prototype.process = function ( file, processContext, callback ) {
    if ( file.extname === 'js' ) {
        var configFile = path.resolve( processContext.baseDir, this.configFile );
        var moduleId = util.getModuleId( file.fullPath, configFile );

        if ( moduleId ) {
            var moduleCode = util.compileModule( file.data, moduleId, configFile );
            if ( moduleCode !== false ) {
                file.setData( moduleCode );
            }
        }
    }
    
    callback();
};

module.exports = exports = ModuleCompiler;
