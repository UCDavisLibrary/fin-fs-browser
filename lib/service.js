const {BaseService} = require('@ucd-lib/cork-app-utils');
const FinFsBrowserStore = require('./store');

class FinFsBrowserService extends BaseService {

  constructor() {
    super();

    this.store = FinFsBrowserStore;

    this.pathRequestCount = 0;
    this.pathQueue = [];
  }

  get basePath() {
    return this.store.data.host+this.store.data.fcBasePath+'/collection/'+this.store.data.collection;
  }

  getPath(path='', minimal=true) {
    if( !path.match(/^\//) ) path = '/'+path;

    let headers = {
      Accept : 'application/ld+json'
    };
    if( minimal ) headers.Prefer = 'return=minimal';

    if( minimal && this.store.data.byPathMinimal[path] ) {
      return this.store.data.byPathMinimal[path];
    } else if( this.store.data.byPath[path] ) {
      return this.store.data.byPath[path];
    }

    let wrapperPromise = new Promise((resolve, reject) => {
      this.pathQueue.push({path,headers,minimal,resolve,reject});
    });

    this.store.setPathLoading(path, minimal, wrapperPromise);
    this._getPath();

    return wrapperPromise;
  }

  async _getPath() {
    if( this.pathQueue.length === 0 ) return;
    if( this.pathRequestCount >= this.store.data.maxPathRequests ) return;

    let req = this.pathQueue.shift();

    // need to wrap up both HEAD and GET requests
    this.pathRequestCount++;
    try {
      req.resolve(await this._getPathRequest(req.path, req.headers, req.minimal));
    } catch(e) {
      req.reject(e);
    }
    this.pathRequestCount--;

    this._getPath();
  }

  async _getPathRequest(path, headers, minimal) {
    let {response} = await this.request({
      url : `${this.basePath}${path}`,
      fetchOptions : {
        method : 'HEAD'
      }
    });

    /**
     * Check if this is a binary container.  if so, always as for full request and append
     * /fcr:metadata to path.  We need to full request for fedora appended size, type and
     * we know we don't get the performance hit of lots of children in response.
     */
    let metadata = '';
    if( response.headers.has('content-disposition') ) {
      metadata = '/fcr:metadata';
      if( minimal ) {
        delete headers.Prefer;
        minimal = false;
      }
    }

    return this.request({
      url : `${this.basePath}${path}${metadata}`,
      fetchOptions : {headers},
      onLoad : result => this.store.setPathLoaded(path, minimal, JSON.parse(result.body)),
      onError : e => this.store.setPathError(path, minimal, e)
    }); 
  }
}

module.exports = new FinFsBrowserService();