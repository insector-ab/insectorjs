import $ from 'jquery';
import defaults from 'lodash.defaults';
import uniqueId from 'lodash.uniqueid';
import path from 'path';

/**
 * XHRService
 */
export class XHRService {

    constructor(baseUrl = '/', defaultAjaxParams) {
        // public
        this.cid = uniqueId('service');
        this._baseUrl = baseUrl;
        this._defaultAjaxParams = defaultAjaxParams || {};
        this._jqXHRs = {};
    }

    get baseUrl() {
        return this._baseUrl;
    }
    set baseUrl(value) {
        this._baseUrl = path.normalize(value);
    }

    get defaultAjaxParams() {
        return this._defaultAjaxParams;
    }

    get(relativeUrl, ajaxParams = {}) {
        let params = this._getAjaxParams(ajaxParams, {method: 'GET'});
        return this.request(relativeUrl, params);
    }

    delete(relativeUrl, ajaxParams = {}) {
        let params = this._getAjaxParams(ajaxParams, {method: 'DELETE'});
        return this.request(relativeUrl, params);
    }

    post(relativeUrl, data, ajaxParams = {}) {
        let params = this._getAjaxParams(ajaxParams, {method: 'POST', data: data});
        return this.request(relativeUrl, params);
    }

    put(relativeUrl, data, ajaxParams = {}) {
        let params = this._getAjaxParams(ajaxParams, {method: 'PUT', data: data});
        return this.request(relativeUrl, params);
    }

    request(relativeUrl, ajaxParams = {}) {
        let url = this._getUrl(relativeUrl);
        return this.ajax(url, ajaxParams);
    }

    ajax(url, ajaxParams = {}) {
        console.log(ajaxParams.method, url, ajaxParams.data);
        return $.ajax(url, ajaxParams);
    }

    dispose() {
        this._deleteReferences();
    }

    _getUrl(relativeUrl) {
        return path.join(this.baseUrl, relativeUrl);
    }

    _getAjaxParams(...ajaxParamObjs) {
        return defaults(...ajaxParamObjs, this.defaultAjaxParams);
    }

    _deleteReferences() {
        delete this._baseUrl;
        delete this._defaultAjaxParams;
        delete this._jqXHRs;
    }

}

// Store multitons
XHRService._instances = new Map();
// Multiton getter
XHRService.get = function(baseUrl = '/', defaultAjaxParams, Constructor) {
    baseUrl = path.normalize(baseUrl);
    // Instance exists?
    if (XHRService._instances.has(baseUrl)) {
        return XHRService._instances.get(baseUrl);
    }
    // Create new XHRService
    Constructor = Constructor || XHRService;
    let service = new Constructor(baseUrl, defaultAjaxParams);
    // Register
    XHRService._instances.set(baseUrl, service);
    // return
    return service;
};
// Alias
XHRService.at = XHRService.get;

/**
 * JSONService
 */
export class JSONService extends XHRService {

    constructor(baseUrl = '/', defaultAjaxParams) {
        super(baseUrl, defaults(defaultAjaxParams, {
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            processData: false
        }));
        // http://www.jsonrpc.org/specification
        this._version = '2.0';
    }

    get version() {
        return this._version;
    }
    set version(value) {
        this._version = value;
    }

    rpc(rpcMethod, params, ajaxParams = {}) {
        ajaxParams = this._getAjaxParams(ajaxParams, {
            method: 'POST',
            data: this._getRPCData(rpcMethod, params)
        });
        return this.ajax(this.baseUrl, ajaxParams);
    }

    // {"jsonrpc": "2.0", "id": 345, "method": "user.get", params: {id: 163886}}
    // {"jsonrpc": "2.0", "id": 346, "method": "diff", "params": [42, 23]}
    // {"jsonrpc": "2.0", "id": 347, "method": "divide", "params": {"dividend": 42, "divisor": 23}}
    _getRPCData(method, params) {
        return {
            method,
            params,
            jsonrpc: this.version,
            id: uniqueId('rpc')
        };
    }

    _getAjaxParams(...ajaxParamObjs) {
        let params = super._getAjaxParams(...ajaxParamObjs);
        // if POST or PUT, stringify json data
        if (params.hasOwnProperty('data') && ['POST', 'PUT'].indexOf(params.method) !== -1) {
            params.data = JSON.stringify(params.data);
        }
        return params;
    }

}
// Multiton getter
JSONService.at = function(baseUrl = '/', defaultAjaxParams) {
    return XHRService.at(baseUrl, defaultAjaxParams, JSONService);
};