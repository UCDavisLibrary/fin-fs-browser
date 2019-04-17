const {BaseService} = require('@ucd-lib/cork-app-utils');
const FinFsBrowserStore = require('./store');

class FinFsBrowserService extends BaseService {

  constructor() {
    super();

    this.store = FinFsBrowserStore;
  }

  get basePath() {
    return this.store.data.host+this.store.data.fcBasePath+'/collection/'+this.store.data.collection;
  }

  async getPath(path='') {
    if( !path.match(/^\//) ) path = '/'+path;

    if( this.store.data.byPath[path] ) {
      return this.store.data.byPath[path];
    }

    // need to wrap up both HEAD and GET requests
    let wrapperPromise = this._getPath(path);
    this.store.setPathLoading(path, wrapperPromise);

    return wrapperPromise;
  }

  async _getPath(path) {
    let {response} = await this.request({
      url : `${this.basePath}${path}`,
      fetchOptions : {
        method : 'HEAD'
      }
    });

    let metadata = '';
    if( response.headers.has('content-disposition') ) {
      metadata = '/fcr:metadata';
    }

    return this.request({
      url : `${this.basePath}${path}${metadata}`,
      fetchOptions : {
        headers : {
          Accept : 'application/ld+json'
        }
      },
      onLoad : result => this.store.setPathLoaded(path, JSON.parse(result.body)),
      onError : e => this.store.setPathError(path, e)
    }); 
  }
}

module.exports = new FinFsBrowserService();