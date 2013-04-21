/**
 * @file {{{file}}}
 * @author {{{author}}}
 */

define( function ( require ) {
    // 引入一个依赖的模块，可以使用require( relative/top-level id ) 
    // var dependModule = require( './dependModule' );

    {{#functionModule}}/**
     * {{{moduleDescription}}}
     */
    function {{{moduleId}}}() {
        // do something here
    }{{/functionModule}}
    {{^functionModule}}/**
     * {{{moduleDescription}}}
     */
    var {{{moduleId}}} = {};
    {{/functionModule}}

    // return模块
    return {{{moduleId}}};
} );
