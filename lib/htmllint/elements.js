/*jslint nomen: true, white: true, node: true */
'use strict';

//
// Validation methodolgies for elements
// https://developer.mozilla.org/en-US/docs/HTML/Element
//

module.exports = [
    {
        element: '*', 
        attributes: {
            'accesskey': true,
            'class': true,
            'contenteditable': true,
            'contextmenu': true,
            'dir': true,
            'draggable': true,
            'dropzone': true,
            'hidden': true,
            'id': true,
            'inert': true,
            'spellcheck': true,
            'style': true,
            'tabindex': true,
            'title': true,
            'translate': true,
            'onabort': true,
            'onblur': true,
            'oncancel': true,
            'oncanplay': true,
            'oncanplaythrough': true,
            'onchange': true,
            'onclick': true,
            'onclose': true,
            'oncontextmenu': true,
            'oncuechange': true,
            'ondblclick': true,
            'ondrag': true,
            'ondragend': true,
            'ondragenter': true,
            'ondragleave': true,
            'ondragover': true,
            'ondragstart': true,
            'ondrop': true,
            'ondurationchange': true,
            'onemptied': true,
            'onended': true,
            'onerror': true,
            'onfocus': true,
            'oninput': true,
            'oninvalid': true,
            'onkeydown': true,
            'onkeypress': true,
            'onkeyup': true,
            'onload': true,
            'onloadeddata': true,
            'onloadedmetadata': true,
            'onloadstart': true,
            'onmousedown': true,
            'onmouseenter': true,
            'onmouseleave': true,
            'onmousemove': true,
            'onmouseout': true,
            'onmouseover': true,
            'onmouseup': true,
            'onmousewheel': true,
            'onpause': true,
            'onplay': true,
            'onplaying': true,
            'onprogress': true,
            'onratechange': true,
            'onreset': true,
            'onscroll': true,
            'onseeked': true,
            'onseeking': true,
            'onselect': true,
            'onshow': true,
            'onsort': true,
            'onstalled': true,
            'onsubmit': true,
            'onsuspend': true,
            'ontimeupdate': true,
            'onvolumechange': true,
            'onwaiting': true
        }
    },
    {
        element: 'a', 
        attributes: { 
            'charset': true,
            'coords': true,
            'download': true,
            'href': true,
            'hreflang': true,
            'media': true,
            'name': true,
            'ping': true,
            'rel': true,
            'rev': true,
            'shape': true,
            'target': true,
            'type': true
        }
    },
    {
        element: 'abbr', 
        attributes: { }
    },
    {
        element: 'acronym', 
        attributes: { }
    },
    {
        element: 'address', 
        attributes: { }
    },
    {
        element: 'applet', 
        attributes: { 
            'align': true,
            'alt': true,
            'archive': true,
            'code': true,
            'codebase': true,
            'datafld': true,
            'datasrc': true,
            'height': true,
            'hspace': true,
            'mayscript': true,
            'name': true,
            'object': true,
            'src': true,
            'vspace': true,
            'width': true
        }
    },
    {
        element: 'area', 
        isVoid: true, 
        attributes: { 
            'accesskey': true,
            'alt': true,
            'coords': true,
            'href': true,
            'hreflang': true,
            'name': true,
            'media': true,
            'nohref': true,
            'rel': true,
            'tabindex': true,
            'target': true,
            'type': true
        }
    },
    {
        element: 'article', 
        attributes: { 
            'autoplay': true,
            'autobuffer': true,
            'buffered': true,
            'controls': true,
            'loop': true,
            'muted': true,
            'played': true,
            'preload': true,
            'src': true
        }
    },
    {
        element: 'aside', 
        attributes: { }
    },
    {
        element: 'audio', 
        attributes: { 
            'autoplay': true,
            'autobuffer': true,
            'buffered': true,
            'controls': true,
            'loop': true,
            'muted': true,
            'played': true,
            'preload': true,
            'src': true
        }
    },
    {
        element: 'b', 
        attributes: { }
    },
    {
        element: 'base', 
        isVoid: true,
        attributes: { 
            'href': true,
            'target': true
        }
    },
    {
        element: 'basefont', 
        attributes: { 
            'color': true,
            'face': true,
            'size': true
        }
    },
    {
        element: 'bdi', 
        attributes: { }
    },
    {
        element: 'bdo', 
        attributes: { 
            'dir': true
        }
    },
    {
        element: 'big', 
        attributes: { }
    },
    {
        element: 'blockquote', 
        attributes: {
            'cite': true
        }
    },
    {
        element: 'body', 
        attributes: { 
            'alink': true,
            'background': true,
            'bgcolor': true,
            'link': true,
            'onafterprint': true,
            'onbeforeprint': true,
            'onbeforeunload': true,
            'onblur': true,
            'onerror': true,
            'onfocus': true,
            'onhashchange': true,
            'onload': true,
            'onmessage': true,
            'onoffline': true,
            'ononline': true,
            'onpopstate': true,
            'onredo': true,
            'onresize': true,
            'onstorage': true,
            'onundo': true,
            'onunload': true,
            'text': true,
            'vlink': true
        }
    },
    {
        element: 'br', 
        isVoid: true, 
        attributes: { 
            'clear': true
        }
    },
    {
        element: 'button', 
        attributes: { 
            'autofocus': true,
            'disabled': true,
            'form': true,
            'formaction': true,
            'formenctype': true,
            'formmethod': true,
            'formnovalidate': true,
            'formtarget': true,
            'name': true,
            'type': true,
            'value': true
        }
    },
    {
        element: 'canvas', 
        attributes: { 
            'width': true,
            'height': true
        }
    },
    {
        element: 'caption', 
        attributes: { 
            'align': true
        }
    },
    {
        element: 'center', 
        attributes: { }
    },
    {
        element: 'cite', 
        attributes: { }
    },
    {
        element: 'code', 
        attributes: { }
    },
    {
        element: 'col', 
        isVoid: true,
        attributes: { 
            'align': true,
            'bgcolor': true,
            'char': true,
            'charoff': true,
            'span': true,
            'valign': true,
            'width': true
        }
    },
    {
        element: 'colgroup', 
        attributes: {
            'align': true,
            'bgcolor': true,
            'char': true,
            'charoff': true,
            'span': true,
            'valign': true,
            'width': true
        }
    },
    {
        element: 'command', 
        isVoid: true,
        attributes: { 
            'checked': true,
            'disabled': true,
            'icon': true,
            'label': true,
            'radiogroup': true,
            'type': true
        }
    },
    {
        element: 'datalist', 
        attributes: { }
    },
    {
        element: 'dd', 
        attributes: { }
    },
    {
        element: 'del', 
        attributes: { 
            'cite': true,
            'datetime': true
        }
    },
    {
        element: 'details', 
        attributes: { 
            'open': true
        }
    },
    {
        element: 'dfn', 
        attributes: { }
    },
    {
        element: 'dir', 
        attributes: { 
            'compact': true
        }
    },
    {
        element: 'div', 
        attributes: { 
            'align': true
        }
    },
    {
        element: 'dl', 
        attributes: { }
    },
    {
        element: 'dt', 
        attributes: { }
    },
    {
        element: 'em', 
        attributes: { }
    },
    {
        element: 'embed', 
        isVoid: true,
        attributes: { 
            'height': true,
            'src': true,
            'type': true,
            'width': true
        }
    },
    {
        element: 'fieldset', 
        attributes: { 
            'disabled': true,
            'form': true,
            'name': true
        }
    },
    {
        element: 'figcaption', 
        attributes: { }
    },
    {
        element: 'figure', 
        attributes: { }
    },
    {
        element: 'font', 
        attributes: { 
            'color': true,
            'face': true,
            'size': true
        }
    },
    {
        element: 'footer', 
        attributes: { }
    },
    {
        element: 'form', 
        attributes: { 
            'accept': true,
            'accept-charset': true,
            'action': true,
            'enctype': true,
            'method': true,
            'name': true,
            'novalidate': true,
            'target': true
        }
    },
    {
        element: 'frame', 
        attributes: { 
            'src': true,
            'name': true,
            'noresize': true,
            'scrolling': true,
            'marginheight': true,
            'marginwidth': true,
            'frameborder': true
        }
    },
    {
        element: 'frameset', 
        attributes: { 
            'cols': true,
            'rows': true
        }
    },
    { 
        element: 'h1',
        attributes: { 
            'align': true
        }
    },
    { 
        element: 'h2',
        attributes: { 
            'align': true
        }
    },
    { 
        element: 'h3',
        attributes: { 
            'align': true
        }
    },
    { 
        element: 'h4',
        attributes: { 
            'align': true
        }
    },
    { 
        element: 'h5',
        attributes: { 
            'align': true
        }
    },
    { 
        element: 'h6',
        attributes: { 
            'align': true
        }
    },
    {
        element: 'head', 
        attributes: { 
            'profile': true
        }
    },
    {
        element: 'header', 
        attributes: { }
    },
    {
        element: 'hgroup', 
        attributes: { }
    },
    {
        element: 'hr', 
        isVoid: true,
        attributes: { 
            'align': true,
            'noshade': true,
            'size': true,
            'width': true
        }
    },
    {
        element: 'html', 
        attributes: { 
            'manifest': true,
            'version': true
        }
    },
    {
        element: 'i', 
        attributes: { }
    },
    {
        element: 'iframe', 
        attributes: { 
            'align': true,
            'frameborder': true,
            'height': true,
            'longdesc': true,
            'marginheight': true,
            'marginwidth': true,
            'name': true,
            'scrolling': true,
            'sandbox': true,
            'seamless': true,
            'src': true,
            'srcdoc': true,
            'width': true
        }
    },
    {
        element: 'img', 
        isVoid: true,
        attributes: { 
            'align': true,
            'alt': true,
            'border': true,
            'crossorigin': true,
            'height': true,
            'hspace': true,
            'ismap': true,
            'longdesc': true,
            'src': true,
            'width': true,
            'usemap': true,
            'vspace': true
        }
    },
    {
        element: 'input', 
        isVoid: true,
        attributes: { 
            'type': true,
            'accept': true,
            'accesskey': true,
            'autocomplete': true,
            'autofocus': true,
            'autosave': true,
            'checked': true,
            'disabled': true,
            'form': true,
            'formaction': true,
            'formenctype': true,
            'formmethod': true,
            'formnovalidate': true,
            'formtarget': true,
            'height': true,
            'inputmode': true,
            'list': true,
            'max': true,
            'maxlength': true,
            'min': true,
            'multiple': true,
            'name': true,
            'pattern': true,
            'placeholder': true,
            'readonly': true,
            'required': true,
            'selectionDirection': true,
            'size': true,
            'spellcheck': true,
            'src': true,
            'step': true,
            'tabindex': true,
            'usemap': true,
            'value': true,
            'width': true
        }
    },
    {
        element: 'ins', 
        attributes: { 
            'cite': true,
            'datetime': true
        }
    },
    {
        element: 'isindex', 
        attributes: { 
            'prompt': true,
            'action': true
        }
    },
    {
        element: 'kbd', 
        attributes: { }
    },
    {
        element: 'keygen', 
        isVoid: true,
        attributes: { 
            'autofocus': true,
            'challenge': true,
            'disabled': true,
            'form': true,
            'keytype': true,
            'name': true
        }
    },
    {
        element: 'label', 
        attributes: { 
            'accesskey': true,
            'for': true,
            'form': true
        }
    },
    {
        element: 'legend', 
        attributes: { }
    },
    {
        element: 'li', 
        attributes: { 
            'value': true,
            'type': true
        }
    },
    {
        element: 'link', 
        attributes: { 
            'charset': true,
            'crossorigin': true,
            'href': true,
            'hreflang': true,
            'media': true,
            'rel': true,
            'rev': true,
            'sizes': true,
            'type': true
        }
    },
    {
        element: 'listing', 
        attributes: { }
    },
    {
        element: 'main', 
        attributes: { }
    },
    {
        element: 'map', 
        attributes: { }
    },
    {
        element: 'mark', 
        attributes: { }
    },
    {
        element: 'menu', 
        attributes: { 
            'type': true,
            'label': true
        }
    },
    {
        element: 'meta', 
        isVoid: true,
        attributes: { 
            'charset': true,
            'content': true,
            'http-equiv': true,
            'name': true,
            'scheme': true
        }
    },
    {
        element: 'meter', 
        attributes: { 
            'value': true,
            'min': true,
            'max': true,
            'low': true,
            'high': true,
            'optimum': true,
            'form': true
        }
    },
    {
        element: 'nav', 
        attributes: { }
    },
    {
        element: 'noframes', 
        attributes: { }
    },
    {
        element: 'noscript', 
        attributes: { }
    },
    {
        element: 'object', 
        attributes: { 
            'archive': true,
            'border': true,
            'classid': true,
            'codebase': true,
            'codetype': true,
            'data': true,
            'declare': true,
            'form': true,
            'height': true,
            'name': true,
            'standby': true,
            'tabindex': true,
            'type': true,
            'usemap': true,
            'width': true
        }
    },
    {
        element: 'ol', 
        attributes: { 
            'compact': true,
            'reversed': true,
            'start': true,
            'type': true
        }
    },
    {
        element: 'optgroup', 
        attributes: { 
            'disabled': true,
            'label': true
        }
    },
    {
        element: 'option', 
        attributes: { 
            'disabled': true,
            'label': true,
            'selected': true,
            'value': true
        }
    },
    {
        element: 'output', 
        attributes: { 
            'for': true,
            'form': true,
            'name': true
        }
    },
    {
        element: 'p', 
        attributes: { 
            'align': true
        }
    },
    {
        element: 'param', 
        isVoid: true,
        attributes: { 
            'name': true,
            'type': true,
            'value': true,
            'valuetype': true
        }
    },
    {
        element: 'plaintext', 
        attributes: { }
    },
    {
        element: 'pre', 
        attributes: { }
    },
    {
        element: 'progress', 
        attributes: { 
            'max': true,
            'value': true
        }
    },
    {
        element: 'q', 
        attributes: { 
            'cite': true
        }
    },
    {
        element: 'rp', 
        attributes: { }
    },
    {
        element: 'rt', 
        attributes: { }
    },
    {
        element: 'ruby', 
        attributes: { }
    },
    {
        element: 's', 
        attributes: { }
    },
    {
        element: 'samp', 
        attributes: { }
    },
    {
        element: 'script', 
        attributes: { 
            'async': true,
            'src': true,
            'type': true,
            'language': true,
            'defer': true
        }
    },
    {
        element: 'section', 
        attributes: { }
    },
    {
        element: 'select', 
        attributes: { 
            'autofocus': true,
            'disabled': true,
            'form': true,
            'multiple': true,
            'selectedIndex': true,
            'name': true,
            'required': true,
            'size': true
        }
    },
    {
        element: 'small', 
        attributes: { }
    },
    {
        element: 'source', 
        isVoid: true,
        attributes: { 
            'src': true,
            'type': true,
            'media': true
        }
    },
    {
        element: 'spacer', 
        attributes: { 
            'type': true,
            'size': true,
            'width': true,
            'height': true,
            'align': true
        }
    },
    {
        element: 'span', 
        attributes: { }
    },
    {
        element: 'strike', 
        attributes: { }
    },
    {
        element: 'strong', 
        attributes: { }
    },
    {
        element: 'style', 
        attributes: { 
            'type': true,
            'media': true,
            'scoped': true,
            'title': true,
            'disabled': true
        }
    },
    {
        element: 'sub', 
        attributes: { }
    },
    {
        element: 'summary', 
        attributes: { }
    },
    {
        element: 'sup', 
        attributes: { }
    },
    {
        element: 'table', 
        attributes: { 
            'align': true,
            'bgcolor': true,
            'border': true,
            'cellpadding': true,
            'cellspacing': true,
            'frame': true,
            'rules': true,
            'summary': true,
            'width': true
        }
    },
    {
        element: 'tbody', 
        attributes: { 
            'align': true,
            'char': true,
            'charoff': true,
            'valign': true
        }
    },
    {
        element: 'td', 
        attributes: { 
            'abbr': true,
            'align': true,
            'axis': true,
            'char': true,
            'charoff': true,
            'colspan': true,
            'headers': true,
            'rowspan': true,
            'scope': true,
            'valign': true
        }
    },
    {
        element: 'textarea', 
        attributes: {
            'autofocus': true,
            'cols': true,
            'disabled': true,
            'form': true,
            'maxlength': true,
            'name': true,
            'placeholder': true,
            'readonly': true,
            'required': true,
            'rows': true,
            'selectionDirection': true,
            'selectionEnd': true,
            'selectionStart': true,
            'spellcheck': true,
            'wrap': true
        }
    },
    {
        element: 'tfoot', 
        attributes: { 
            'align': true,
            'char': true,
            'charoff': true,
            'valign': true
        }
    },
    {
        element: 'th', 
        attributes: { 
            'abbr': true,
            'align': true,
            'axis': true,
            'char': true,
            'charoff': true,
            'colspan': true,
            'headers': true,
            'rowspan': true,
            'scope': true,
            'valign': true
        }
    },
    {
        element: 'thead', 
        attributes: { 
            'align': true,
            'char': true,
            'charoff': true,
            'valign': true
        }
    },
    {
        element: 'time', 
        attributes: { 
            'datetime': true,
            'pubdate': true
        }
    },
    {
        element: 'title', 
        attributes: { }
    },
    {
        element: 'tr', 
        attributes: { 
            'align': true,
            'bgcolor': true,
            'char': true,
            'charoff': true,
            'valign': true
        }
    },
    {
        element: 'track', 
        isVoid: true,
        attributes: { 
            'default': true,
            'kind': true,
            'subtitles': true,
            'captions': true,
            'descriptions': true,
            'chapters': true,
            'metadata': true,
            'label': true,
            'src': true,
            'srclang': true
        }
    },
    {
        element: 'tt', 
        attributes: { }
    },
    {
        element: 'u', 
        attributes: { }
    },
    {
        element: 'ul', 
        attributes: { 
            'compact': true,
            'type': true
        }
    },
    {
        element: 'var', 
        attributes: { }
    },
    {
        element: 'video', 
        attributes: { 
            'autoplay': true,
            'buffered': true,
            'controls': true,
            'crossorigin': true,
            'height': true,
            'loop': true,
            'muted': true,
            'played': true,
            'preload': true,
            'poster': true,
            'src': true,
            'width': true
        }
    },
    {
        element: 'wbr', 
        isVoid: true,
        attributes: { }
    },
    {
        element: 'xmp', 
        attributes: { }
    }
];