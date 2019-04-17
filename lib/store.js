const {BaseStore} = require('@ucd-lib/cork-app-utils');

class FinFsBrowserStore extends BaseStore {

  constructor() {
    super();

    this.data = {
      host : '',
      fcBasePath : '/fcrepo/rest',
      collection : '',
      byPath : {}
    }

    this.events = {
      FIN_FS_BROWSER_PATH_UPDATE : 'fin-fs-browser-path-update'
    }
  }

  setHost(host) {
    if( this.data.host === host ) return;
    this.data.host = host;
    this.data.byPath = {};
  }

  setCollection(collection) {
    if( this.data.collection === collection ) return;
    this.data.collection = collection;
    this.data.byPath = {};
  }

  setPathLoading(path, promise) {
    this._setState({
      state: this.STATE.LOADING, 
      id: path,
      request : promise
    });
  }

  setPathLoaded(path, payload) {
    this._setState({
      state: this.STATE.LOADED,   
      id:path, payload
    });
  }

  setPathError(path, error) {
    this._setState({
      state: this.STATE.ERROR,   
      id:path, error
    });
  }

  getPath(path) {
    return this.data.byPath[path];
  }

  _setState(state) {
    this.data.byPath[state.id] = state;
    this.emit(this.events.FIN_FS_BROWSER_PATH_UPDATE, state);
  }
}

module.exports = new FinFsBrowserStore();