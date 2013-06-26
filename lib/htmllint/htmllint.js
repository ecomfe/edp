var jsdom = require('jsdom').jsdom,
    parser = require('./html5');

var defaultRules = require('./elements');

var flatten = function(input, shallow, output) {
        _.each(input, function(value) {
            if(_.isArray(value)) {
                shallow
                    ? push.apply(output, value)
                    : flatten(value, shallow, output);
            } else {
                output.push(value);
            }
        });
        return output;
    };

var _ = {
    each: function(obj, fn) {
        return obj && Array.prototype.forEach.call(obj, fn);
    },

    first: function(obj) {
        return obj[0];
    },

    last: function(obj) {
        return obj[obj.length - 1];
    },

    flatten: function(array, shallow) {
        return flatten(array, shallow, []);
    },

    filter: function(obj, iterator, context) {
        return Array.prototype.filter.call(obj, iterator, context);
    },

    pluck: function(obj, key) {
        return _.map(obj, function(value) {
            return value[key];
        });
    },

    where: function(obj, attrs) {
        if(!attrs) {
            return [];
        }

        return _.filter(obj, function(value) {
            for(var key in attrs) {
                if(attrs[key] !== value[key]) {
                    return false;
                }
            }
            return true;
        });
    }
};

var toString = Object.prototype.toString;
_.each(
    ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Array'],
    function(name) {
        _['is' + name] = function(obj) {
            return toString.call(obj) == '[object ' + name + ']';
        };
    }
);

/* jshint camelcase:false */
module.exports.lint = function Lint(src, rules) {
    var info = [];

    rules = rules || ['core'];
    _.each(rules, function(v, i) {
        if(v === 'core') {
            rules.splice.apply(rules, [i, 1].concat(defaultRules));
        }
    });

    _.each(rules, function(rule) {
        if(rule.element) {
            rule.element = rule.element.toLowerCase();
            _.each(rule.attributes, function(value, name) {
                delete rule.attributes[name];
                rule.attributes[name.toLowerCase()] = value;
            });
        }
    });

    var stack = [],
        last_attr = null,
        doc = jsdom(''),
        cxt = doc;

    var getLocation = function(offset) {
            var lines = src.substring(0, offset).split('\n');
            var column = lines[lines.length - 1].length + 1;
            return {
                line: lines.length,
                column: column
            };
        };

    var lint = {
        _current: null,
        warn: function(m) {
            var onValue = _.isString(m) ? false : (m.valueof || false),
                attr = onValue ? onValue : (m.attribute || null),
                message = _.isString(m) ? m : (m.warn || 'ERROR'),
                offset = _.isString(m) ? 0 : (m.offset || 0),
                match = _.isString(m) ? null : (m.match || null);

            var os;
            if(attr) {
                var attr_offset = lint._current.attr_offset[attr];
                if(onValue) {
                    os = attr_offset.value
                        || attr_offset.name
                        || lint._current.os;
                    match = match || lint._current.getAttribute(attr);
                } else {
                    os = attr_offset.name || lint._current.os;
                    match = match || attr;
                }
            } else {
                os = lint._current.offset;
                match = match || lint._current.nodeName.toLowerCase();
            }

            lint.parser_warn(message, match, os + offset);
        },
        parser_warn: function(msg, match, offset) {
            var loc = getLocation(offset);
            info.push({
                warning: msg + (match ? ': ' + match : ''),
                length: _.flatten(match).join('').length || 1,
                //offset: offset,
                //source: msg.toLowerCase(),
                // message: msg,
                line: loc.line,
                column: loc.column,
                character: loc.column
            });
        },
        parser_emit: function(msg, match, offset) {
            var value = _.flatten(match).join('');

            switch(msg) {
            case 'DOCTYPE':
                //Set doctype to doc
                if(value !== '<!DOCTYPE html>') {
                    lint.parser_warn('INVALID_DOCTYPE', match, offset);
                }
                doc.doctype = value;
                break;

            case 'CHAR':
                //Set context as text node if not
                if(cxt.nodeType !== doc.TEXT_NODE) {
                    var tn = doc.createTextNode('');
                    tn.offset = offset;
                    cxt.appendChild(tn);
                    cxt = tn;
                }
                //Append value to context
                cxt.nodeValue += value;
                break;

            case 'COMMENT':
                //Append comment to context
                var cn = doc.createComment(value);
                cn.offset = offset;
                if(cxt.nodeType === doc.TEXT_NODE) {
                    cxt.parentNode.appendChild(cn);
                } else {
                    cxt.appendChild(cn);
                }
                cxt = cn.parentNode;
                break;

            case 'TAG_START':
                //Set new tag as context, append to parent
                var tag = value.toLowerCase();
                var en = doc.createElement(tag);
                en.offset = offset;
                en.attr_offset = {};

                if(cxt.nodeType === doc.TEXT_NODE) {
                    cxt.parentNode.appendChild(en);
                } else {
                    cxt.appendChild(en);
                }

                cxt = en;
                stack.push(tag);

                //Warn if tags are not all lowercase
                if(value !== tag) {
                    lint.parser_warn('NOT_LOWERCASE_TAG', [value], offset);
                }

                //Warn if tag is not listed under support or is disallowed
                if(_.where(rules, {
                    element: tag
                }).length === 0 || _.where(rules, {
                    element: tag,
                    disallow: true
                }).length > 0) {
                    lint.parser_warn('UNSUPPORTED_TAG', [value], offset);
                }

                break;

            case 'TAG_OPEN':
                //If tag is void, set context as parent
                var tag = _.last(stack);
                if(_.where(rules, {
                    element: tag,
                    isVoid: true
                }).length > 0) {
                    stack.pop();
                    cxt = cxt.parentNode;
                }
                break;

            case 'TAG_CLOSE':
                var tag = value.toLowerCase(),
                    flag = false;

                //If we closed a tag that doesn't exist then warn and exit
                if(stack.indexOf(tag) === -1) {
                    lint.parser_warn('UNOPENED_CLOSED_TAG', [value], offset);
                    return;
                }

                //Push up context until we are at tagname
                while(cxt.tagName !== tag.toUpperCase()) {
                    if(cxt.nodeType === doc.ELEMENT_NODE) {
                        stack.pop();
                        flag = true;
                    }
                    cxt = cxt.parentNode;
                }

                //Warn if we had to popup
                if(flag) {
                    lint.parser_warn(
                        'INCORRECT_CLOSE_TAG_ORDER',
                        [value],
                        offset
                    );
                }

                //Set the contest as parent
                cxt = cxt.parentNode;
                stack.pop();

                //Warn if tags are not all lowercase
                if(value !== tag) {
                    lint.parser_warn('NOT_LOWERCASE_TAG', [value], offset);
                }
                break;

            case 'ATTRIBUTE_NAME':
                var attr = value.toLowerCase(),
                    tag = cxt.tagName.toLowerCase();

                //If attribute is already defined, warn and exit
                if(cxt.hasAttribute(attr)) {
                    lint.parser_warn('DUPLICATE_ATTRIBUTE', [value], offset);
                    last_attr = null;
                    return;
                }

                //Add attribute to element with self string value
                cxt.setAttribute(attr, attr);
                cxt.attr_offset[attr] = {
                    name: offset
                };
                last_attr = attr;

                //If not global, element, or data then warn
                if(!(/^data-.+$/.test(attr) || _.where(rules, {
                    element: '*'
                })[0].attributes[attr] || _.where(rules, {
                    element: tag
                })[0].attributes[attr])) {
                    lint.parser_warn(
                        'UNSUPPORTED_ATTRIBUTE',
                        [value],
                        offset
                    );
                }

                //Warn if attributes are not all lowercase
                if(value !== attr) {
                    lint.parser_warn(
                        'NOT_LOWERCASE_ATTRIBUTE',
                        [value],
                        offset
                    );
                }
                break;

            case 'ATTRIBUTE_VALUE':
                //Set value to attribute if last is non-null
                if(last_attr !== null) {
                    cxt.attributes[last_attr].value = value;
                    cxt.attr_offset[last_attr].value = offset;
                }
                break;

            case 'EOF':
                _.each(stack, function(value) {
                    lint.parser_warn('UNCLOSED_TAG', null, offset);
                });
                break;

            default:
                throw new Error('Unsupported message ' + msg);
            }
        }
    };

    //Run the parser
    var old_global = global.lint;
    global.lint = lint;
    parser.parse(src + '\0');
    global.lint = old_global;

    //Run additional rules
    _.each(rules, function(rule) {
        if(rule.test) {
            _.each(doc.querySelectorAll(rule.on || '*'), function(e, i) {
                lint._current = e;
                rule.test.call(e, i, e, lint);
            });
        }
    });

    // console.log( doc.doctype + doc.innerHTML );
    return info;
};