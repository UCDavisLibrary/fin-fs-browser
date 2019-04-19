const {BaseStore} = require('@ucd-lib/cork-app-utils');

class FinFsBrowserStore extends BaseStore {

  constructor() {
    super();

    this.data = {
      maxPathRequests : 3,
      host : '',
      fcBasePath : '/fcrepo/rest',
      collection : '',
      byPath : {},
      byPathMinimal : {}
    }

    this.events = {
      FIN_FS_BROWSER_PATH_UPDATE : 'fin-fs-browser-path-update'
    }
  }

  setHost(host) {
    if( this.data.host === host ) return;
    this.data.host = host;
    this.data.byPath = {};
    this.data.byPathMinimal = {};
  }

  setCollection(collection) {
    if( this.data.collection === collection ) return;
    this.data.collection = collection;
    this.data.byPath = {};
    this.data.byPathMinimal = {};
  }

  setPathLoading(path, minimal, promise) {
    this._setPathState({
      state: this.STATE.LOADING, 
      id: path,
      minimal,
      request : promise
    }, minimal);
  }

  setPathLoaded(path, minimal, payload) {
    this._setPathState({
      state: this.STATE.LOADED,   
      minimal,
      id:path, payload
    }, minimal);
  }

  setPathError(path, minimal, error) {
    this._setPathState({
      state: this.STATE.ERROR,
      minimal,
      id:path, error
    }, minimal);
  }

  getMinimalPath(path) {
    let fullPath = this.getPath(path);
    if( fullPath ) return fullPath;
    return this.data.byPathMinimal[path];
  }

  getPath(path) {
    return this.data.byPath[path];
  }

  _setPathState(state, minimal) {
    if( minimal ) {
      this.data.byPathMinimal[state.id] = state;
    } else {
      if( this.data.byPathMinimal[state.id] ) {
        delete this.data.byPathMinimal[state.id];
      }
      this.data.byPath[state.id] = state;
    }
    this.emit(this.events.FIN_FS_BROWSER_PATH_UPDATE, state);
  }
}

module.exports = new FinFsBrowserStore();