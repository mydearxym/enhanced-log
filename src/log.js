;(function (global, Object, Array, prototype, __proto__){

    // =====================================
    // Private interface
    // =====================================

    var enabled = true

    function _log(message, logger){
        if(enabled) {
            logger.api[logger.method]('%c' + logger.mapper(message), _createStyles(_result(logger.styles)))
        }
    }

    function _inherit(parent, child){
        return LogFactory(_extend(Object.create(parent), child, {
                    styles: _compose(Function.apply.bind(_extend, null), Array[prototype].map.bind([{}, child.styles || {}, parent.styles], _result))
                ,   mapper: _compose(child.mapper || _id, parent.mapper)
                }))
    }

    // -------------------------------------
    // Utils
    // -------------------------------------

    function _id(arg){
        return arg
    }

    function _result(arg){
        return typeof arg == 'function' ? arg() : arg
    }
    
    function _extend(target, source){
        for(var i = 1; i < arguments.length; i++){
            source = arguments[i]
            for(var prop in source){
                target[prop] = source[prop]
            }
        }
        return target
    }

    function _compose(){
        var functions = Array.apply(null, arguments)
        ,   count = functions.length - 1

        return function composed() {
            for(var i = count, result = functions[i].apply(null, arguments); i--;) {
                result = functions[i].call(null, result)
            }
            return result
        }
    }

    // {'color': '#C7254E','background-color': '#F9F2F4'} => "color:#C7254E;background-color:#F9F2F4;"
    function _createStyles(styles){
        styles = Object.keys(styles).reduce(function (acc, style){
            return acc.push([style, styles[style]].join(':')), acc
        }, []).join(';')
        return styles ? styles + ';' : ''
    }

    // "color:#C7254E;background-color:#F9F2F4;" => {'color': '#C7254E','background-color': '#F9F2F4'}
    function _parseStyles(styles){
        return styles.replace(/;$/, '').split(';').reduce(function (acc, style){
            if(style) {
                acc[style = style.split(':'), style[0].trim()] = style[1].trim()
            }
            return acc
        }, {})
    }

    // -------------------------------------
    // Divider
    // -------------------------------------
 
    var DEFAULT_DIVIDER_LENGTH = 50
    ,   DEFAULT_DIVIDER_SYMBOL = '='
 
    function _divider(text, symbol, length){
        length = length || DEFAULT_DIVIDER_LENGTH
        symbol = symbol || DEFAULT_DIVIDER_SYMBOL
        if(typeof text == 'number'){
            length = text
            text = null
        }
        if(/^\W+$/.test(text)){
            if(typeof symbol == 'number'){
                length = symbol
            }
            symbol = text
            text = null
        }
        if(text){
            if(typeof symbol == 'number'){
                length = symbol
                symbol = DEFAULT_DIVIDER_SYMBOL
            }
            if(/\n/.test(text)){
                return text.replace('\r', '').split('\n').map(function (text){
                    return _divider(text, symbol, length)
                }).join('\n')
            }
            else {
                length = Math.ceil((length - (text.length + 2)) / 2)
                
                var start = Array(length).join(symbol)
                ,   end = Array(length).join(symbol)
 
                return [start, text, end].join(' ')                
            }
        }
        else {
            return Array(length).join(symbol)
        }
    }

    // -------------------------------------
    // Callout
    // -------------------------------------
 
    var DEFAULT_CALLOUT_SYMBOL = String.fromCharCode(9612)
 
    function _callout(message, symbol){
        symbol = symbol || DEFAULT_CALLOUT_SYMBOL
        if(/\n/.test(message)){
            return [
                    '\t' + symbol
                ,   message.replace('\r', '').split('\n').map(function (message){ return '\t' + symbol + ' ' + message }).join('\r\n')
                ,   '\t' + symbol
                ].join('\r\n')
        }
        else {            
            return [
                    '\t' + symbol
                ,   '\t' + symbol + ' ' + message
                ,   '\t' + symbol
                ].join('\r\n')
        }
    }

    // =====================================
    // Constructor
    // =====================================

    function LogFactory(base){
        base = base || proto

        function log(message){
            'use strict';
            _log(message, log)
        }

        log[__proto__] = base

        return log
    }

    // =====================================
    // Public interface
    // =====================================

    var utils = {
            id: _id
        ,   result: _result
        ,   compose: _compose
        ,   extend: _extend
        ,   createStyles: _createStyles
        ,   parseStyles: _parseStyles
        ,   divider: _divider
        ,   callout: _callout
        }

    var defaults = {
            large: { 
                styles: { 
                    'font-size'  : '18px' 
                } 
            }
        ,   huge: { 
                styles: { 
                    'font-size'  : '24px' 
                } 
            }
        ,   small: { 
                styles: { 
                    'font-size'  : '10px' 
                } 
            } 

        ,   info: { 
                styles: { 
                    'color' : '#03a9f4' 
                } 
            }
        ,   success: { 
                styles: { 
                    'color' : '#259b24' 
                } 
            }
        ,   warning: { 
                styles: { 
                    'color' : '#ff9800' 
                } 
            }
        ,   danger: { 
                styles: { 
                    'color' : '#e51c23' 
                } 
            } 

        ,   underline: { 
                styles: { 
                    'text-decoration': 'underline'
                } 
            }
        ,   overline: { 
                styles: { 
                    'text-decoration': 'overline'
                } 
            }
        ,   linethrough: { 
                styles: { 
                    'text-decoration': 'line-through' 
                } 
            } 

        ,   capitalize: { 
                styles: { 
                    'text-transform': 'capitalize' 
                } 
            }
        ,   uppercase: { 
                styles: { 
                    'text-transform': 'uppercase'  
                } 
            }
        ,   lowercase: { 
                styles: { 
                    'text-transform': 'lowercase'  
                } 
            } 

        ,   bold: { 
                styles: { 
                    'font-weight': 'bold'   
                } 
            }
        ,   italic: { 
                styles: { 
                    'font-style' : 'italic' 
                } 
            } 

        // like bootstrap <code>...<code/>
        ,   code: { 
                styles: {
                    'color': '#C7254E'
                ,   'background-color': '#F9F2F4'
                }
            }

        // just logo
        ,   logo: { 
                styles:{
                    'font-size':'46px'
                ,   'font-family': 'Roboto, Helvetica, sans-serif'
                ,   'color': '#FFEB3B'
                ,   'padding':'20px'
                ,   'line-height':'110px'
                ,   'background-color':'#212121;'
                }
            }

        ,   divider: {
                mapper: _divider
            }
        ,   callout: {
                mapper: _callout
            }
        }

    function mixin(target){
        var source = {}
        for(var prop in target){
            !function (name, value){
                proto.defaults[name] = value
                source[name] = {
                    get: function(){ return _inherit(this, value) }
                ,   configurable: true
                }
            }(prop, target[prop])
        }
        Object.defineProperties(proto, source)
    }

    var proto = LogFactory[prototype] = _extend(Object.create(Function[prototype]), {
            mapper: _id
        ,   styles: {}
        ,   method: 'log'
        ,   api: console
        ,   utils: utils
        ,   defaults: {}
        ,   mixin: mixin
        ,   toString: function (){ return _createStyles(_result(this.styles)) }
        ,   toJSON: function (){ return _result(this.styles) }
        ,   on: function (){ enabled = true }
        ,   off: function (){ enabled = false }
        ,   toggle: function (enable){ enabled = enable !== void 0 ? enable : !enabled }
        ,   constructor: LogFactory
        })

    mixin(defaults)

    // =====================================
    // Export
    // =====================================

    if (typeof define == 'function' && define.amd) {
        define(function() { return LogFactory() })
    } 
    else if (typeof module != 'undefined' && module.exports) {
        module.exports = LogFactory()
    } 
    else {
        global.log = LogFactory()
    }

}(this, Object, Array, 'prototype', '__proto__'))