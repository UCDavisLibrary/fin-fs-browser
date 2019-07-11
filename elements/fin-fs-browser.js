import { LitElement } from 'lit-element';
import render from "./fin-fs-browser.tpl.js"

import "./ffsb-table-row"
import "./virtual-list/ffsb-virtual-list"

export default class FinFsBrowser extends Mixin(LitElement)
  .with(LitCorkUtils) {

  static get properties() {
    return {
      root : {type: String},
      host : {type: String},
      collection : {type: String},
      children : {type: Array},
      loading : {type: Boolean},
      path : {type: String},
      isRoot : {type: Boolean}
    }
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.createListElement = this.createListElement.bind(this);

    this._injectModel('FinFsBrowserModel');

    this.root = '/';
    this.collection = '';
    this.host = '';
    this.children = [];
    this.isRoot = true;
    this.loading = false;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  update(props) {
    if( props.has('collection') ) {
      this.FinFsBrowserModel.setCollection(this.collection);
    }
    if( props.has('host') ) {
      this.FinFsBrowserModel.setHost(this.host);
    }
    super.update(props);
  }

  async setPath(path) {
    this.path = path;
    this.isRoot = (path === this.root);

    this.loading = true;
    let data = await this.FinFsBrowserModel.getPath(path);
    this.loading = false;


    this.children = this.FinFsBrowserModel
      .getGraphProperty(data.payload, this.FinFsBrowserModel.PROPERTIES.CONTAINS)
      .map(id => id.replace(this.FinFsBrowserModel.service.basePath, ''));
  }

  createListElement() {
    let ele = document.createElement('ffsb-table-row');
    ele.addEventListener('click', e => this._onChildClicked(e));
    return ele;
  }

  async _onBackClicked() {
    let data = await this.FinFsBrowserModel.getPath(this.path);
    let parent = this.FinFsBrowserModel
      .getGraphProperty(data.payload, this.FinFsBrowserModel.PROPERTIES.HAS_PARENT, true)
      .replace(this.FinFsBrowserModel.service.basePath, '');
    if( !parent ) parent = '/';
    this.setPath(parent);
  }

  async _onChildClicked(e) {
    let path = e.target.path;

    this.loading = true;
    let data = await this.FinFsBrowserModel.getPath(path);
    this.loading = false;

    let graph = data.payload;
    if( this.FinFsBrowserModel.isBinary(graph) ) {
      if( Array.isArray(graph) ) graph = graph[0];
      window.open(graph['@id']);
    } else {
      this.setPath(path);
    }
  }

}

customElements.define('fin-fs-browser', FinFsBrowser);
