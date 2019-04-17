const {BaseModel} = require('@ucd-lib/cork-app-utils');

const FinFsBrowserStore = require('./store');
const FinFsBrowserService = require('./service');

class FinFsBrowserModel extends BaseModel {

  constructor() {
    super();

    this.PROPERTIES = {
      NAME : 'http://schema.org/name',
      FILENAME : 'http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#filename',
      CONTAINS : 'http://www.w3.org/ns/ldp#contains',
      HAS_PARENT : 'http://fedora.info/definitions/v4/repository#hasParent',
      HAS_SIZE : 'http://www.loc.gov/premis/rdf/v1#hasSize'
    }
    this.TYPES = {
      BINARY : 'http://fedora.info/definitions/v4/repository#Binary'
    }

    this.store = FinFsBrowserStore;
    this.service = FinFsBrowserService;

    this.register('FinFsBrowserModel');
  }

  setHost(host) {
    this.store.setHost(host);
  }

  setCollection(collection) {
    this.store.setCollection(collection);
  }

  /**
   * @method getPath
   *
   * @returns {Promise}
   */
  async getPath(path, deferLoadChildren=true) {
    let state = this.store.getPath(path);

    try {
      if( state && state.request ) {
        await state.request;
      } else {
        await this.service.getPath(path);
      }      
    } catch(e) {}

    return this.store.getPath(path);
  }

  isBinary(graph) {
    if( Array.isArray(graph) ) graph = graph[0];
    return (graph['@type'].indexOf(this.TYPES.BINARY) > -1 );
  }

  getGraphName(graph) {
    let name = this.getGraphProperty(graph, this.PROPERTIES.FILENAME, true);
    if( name ) return name;
    name = this.getGraphProperty(graph, this.PROPERTIES.NAME, true);
    if( name ) return name;
    
    if( Array.isArray(graph) ) {
      graph = graph[0];
    }
    return graph['@id'].replace(/\/$/, '').split('/').pop();
  }

  getGraphProperty(graph, prop, singleton) {
    if( Array.isArray(graph) ) {
      graph = graph[0];
    }

    let val = graph[prop] || [];
    if( !val.length ) {
      if( singleton ) return null;
      return [];
    }

    if( singleton ) return this._ldValue(val[0]);
    return val.map(v => this._ldValue(v));
  }

  _ldValue(val) {
    if( val['@id'] ) return val['@id'];
    if( val['@value'] ) return val['@value'];
    return null;
  }

  /**
   * @method set
   * @description Update some app state
   */
  set(data) {
    this.store.update(data)
  }
}

module.exports = new FinFsBrowserModel();