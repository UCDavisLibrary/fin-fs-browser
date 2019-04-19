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
  }

  update(props) {
    if( props.has('path') ) {
      this._onPathUpdate();
    }
    super.update(props);
  }

  async _onPathUpdate() {
    this.size = '';
    let data = await this.FinFsBrowserModel.getMinimalPath(this.path);
    if( data.state === 'error' )  return;

    if( this.FinFsBrowserModel.isBinary(data.payload) ) {
      let size = this.FinFsBrowserModel
      .getGraphProperty(data.payload, this.FinFsBrowserModel.PROPERTIES.HAS_SIZE, true);
      this.size = prettyBytes(parseInt(size));
    }
  }

}

customElements.define('ffsb-path-size', FfsbPathSize);
