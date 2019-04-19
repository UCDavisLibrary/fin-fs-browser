import { LitElement } from 'lit-element';
import render from "./ffsb-path-size.tpl.js"

import prettyBytes from "pretty-bytes"

export default class FfsbPathSize extends Mixin(LitElement)
  .with(LitCorkUtils) {

  static get properties() {
    return {
      size : {type: String},
      path : {type: String}
    }
  }

  constructor() {
    super();
    this.render = render.bind(this);

    this._injectModel('FinFsBrowserModel');

    this.size = '';
    this.path = '';
  }

  update(props) {
    if( props.has('path') ) {
      this._onPathUpdate();
    }
    super.update(props);
  }

  async _onPathUpdate() {
    if( !this.path ) return;
    
    this.size = '';

    // see if it's already loaded.  if so, set
    let state = this.FinFsBrowserModel.store.getMinimalPath(this.path);
    if( state && state.state === 'loaded' ) {
      if( this.FinFsBrowserModel.isBinary(state.payload) ) {
        let size = this.FinFsBrowserModel
        .getGraphProperty(state.payload, this.FinFsBrowserModel.PROPERTIES.HAS_SIZE, true);
        this.size = prettyBytes(parseInt(size));
      }
      return;
    } 

    if( this.updateTimer ) clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(async () => {
      this.updateTimer = null;
      
      let data = await this.FinFsBrowserModel.getMinimalPath(this.path);
      if( data.id !== this.path ) return;
      if( data.state !== 'loaded' ) return;

      if( this.FinFsBrowserModel.isBinary(data.payload) ) {
        let size = this.FinFsBrowserModel
        .getGraphProperty(data.payload, this.FinFsBrowserModel.PROPERTIES.HAS_SIZE, true);
        this.size = prettyBytes(parseInt(size));
      }
    }, 100);    
  }

}

customElements.define('ffsb-path-size', FfsbPathSize);
