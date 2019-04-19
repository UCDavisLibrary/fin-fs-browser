import { LitElement } from 'lit-element';
import render from "./ffsb-path-icon.tpl.js"

import "@polymer/iron-icons"
import "@polymer/iron-icons/editor-icons"

export default class FfsbPathIcon extends Mixin(LitElement)
  .with(LitCorkUtils) {

  static get properties() {
    return {
      icon : {type: String},
      path : {type: String}
    }
  }

  constructor() {
    super();
    this.render = render.bind(this);

    this._injectModel('FinFsBrowserModel');

    this.icon = 'radio-button-unchecked';
  }

  update(props) {
    if( props.has('path') ) {
      this._onPathUpdate();
    }
    super.update(props);
  }

  async _onPathUpdate() {
    this.icon = 'radio-button-unchecked';
    let data = await this.FinFsBrowserModel.getMinimalPath(this.path);
    if( data.state === 'error' ) {
      return this.icon = 'error';
    }

    if( this.FinFsBrowserModel.isBinary(data.payload) ) {
      this.icon = 'editor:insert-drive-file';
    } else {
      this.icon = 'folder';
    }
  }

}

customElements.define('ffsb-path-icon', FfsbPathIcon);
