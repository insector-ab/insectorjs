import _ from 'lodash';
import {modelRegistry} from 'mozy';
import {SET_SILENT} from 'mozy/model';

/**
 * Extend prototype
 * @param  {Object} obj      [Object/Class to extend]
 * @param  {Object args} ... [Objects to extend obj with]
 * @return {Object}
 */
export function extend(obj) {
    var source, prop, propDesc;
    for (var i = 1, length = arguments.length; i < length; i++) {
        source = arguments[i];
        for (prop in source) {
            if (source.hasOwnProperty(prop)) {
                propDesc = Object.getOwnPropertyDescriptor(source, prop);
                Object.defineProperty(obj, prop, propDesc);
            }
        }
    }
    return obj;
};

/**
 * mixin
 * @param  {Class} TargetCls [description]
 * @param  {Class} MixinCls  [description]
 */
export function mixin(TargetCls, MixinCls) {
    let target = TargetCls.prototype;
    let source = MixinCls.prototype;
    Object.getOwnPropertyNames(source).forEach(function(name) {
        if (name !== 'constructor') {
            Object.defineProperty(target, name, Object.getOwnPropertyDescriptor(source, name));
        }
    });
}

/**
 * EventPhase
 */
export class EventPhase {}
EventPhase.CAPTURE = true;
EventPhase.BUBBLE = false;

/**
 * Define Constant Class methods
 */
function defineConstantsClassMethods(Cls) {
    // Check if Cls has constant
    Cls.has = function(constantName) {
        return typeof this.__lookupGetter__(constantName) !== 'undefined';
    };
    // Check if Cls has constant value
    Cls.hasValue = function(constantValue) {
        return this.allValues.indexOf(constantValue) > -1;
    };
    // 'allKeys' getter. List of defined constant keys on Cls.
    Object.defineProperty(Cls, 'allKeys', {
        get: function() {
            if (!this.hasOwnProperty('_allKeys_')) {
                this['_allKeys_'] = _.filter(_.keys(Cls), function(k) { return k.match(/^[A-Z0-9_]+$/); });
            }
            return this['_allKeys_'];
        }
    });
    // 'allValues' getter. List of defined constant values on Cls.
    Object.defineProperty(Cls, 'allValues', {
        get: function() {
            if (!this.hasOwnProperty('_allValues_')) {
                this['_allValues_'] = _.map(this.allKeys, key => {
                    return this[key];
                });
            }
            return this['_allValues_'];
        }
    });
}

/**
 * addConstantsToClass
 */
export function addConstantsToClass(Cls, keyValues) {
    // Create constants
    for (var key in keyValues) {
        if (keyValues.hasOwnProperty(key)) {
            Object.defineProperty(Cls, key, {
                value: keyValues[key],
                writable: false,
                enumerable: true,
                configurable: false
            });
        }
    }
    // If no class methods defined
    if (!Cls.hasOwnProperty('has')) {
        defineConstantsClassMethods(Cls);
    }
}

/**
 * importConstantsToClass
 * @param  {Class} Cls              [description]
 * @param  {Class} FromCls          [description]
 * @param  {List of strings} keys   [description]
 */
export function importConstantsToClass(Cls, FromCls, keys) {
    for (let key, i = 0, il = keys.length; i < il; i++) {
        key = keys[i];
        Cls[key] = FromCls[key];
    }
    // If no class methods defined
    if (!Cls.hasOwnProperty('has')) {
        defineConstantsClassMethods(Cls);
    }
}

/**
 * Check if value is Symbol
 * @param  {*} value
 * @return {Boolean}
 */
export function isSymbol(value) {
    try {
        return value.toString().substr(0, 7) === 'Symbol(';
    } catch (err) {}
    return false;
}

/**
 * defaultNewModelInstance
 * @param {Object} props React.Component props
 * @param {mozy.Model} ModelCls Constructor to instantiate
 * @param {String} instanceKey Key to set on parent model
 * @param {Object} data Constructor param
 * @return {mozy.Model} Model instance
 */
export function defaultNewModelInstance(props, ModelCls, instanceKey, data = {}) {
    // Standalone/debug
    if (!props.parentModel) {
        return new ModelCls(data, props);
    }
    // keep until registry supports more arguments than data
    let m;
    let d = props.parentModel.get(instanceKey, data);
    if (!modelRegistry.has(d.uuid)) {
        m = new ModelCls(d, props);
        m.instanceKey = instanceKey;
        modelRegistry.registerModel(m);
    } else {
        m = modelRegistry.get(d.uuid);
        m.props = props;
    }
    // store module instance data on parent Model
    props.parentModel.set(instanceKey, m.getModelData(), SET_SILENT);

    return m;
}
