/**
 * @file htmllint默认配置
 * @author chris[wfsr@foxmail.com]
 */
/*jslint nomen: true, white: true, node: true */
'use strict';

module.exports = [
    'core',
    {
        on: 'div:not([class])',
        test: function(index, element, lint) {
            lint.warn('CLASSLESS_DIV');
        }
    },
    {
        on: '*',
        test: function(index, element, lint) {
            var cls = this.className;
            if(this.hasAttribute('class') && /^\s*$/.test(cls)) {
                lint.warn('EMPTY_CLASS');
            }
        }
    },
    {
        on: 'p div',
        test: function(index, element, lint) {
            lint.warn('INVALID_BLOCK_ELEMENT');
        }
    }
];