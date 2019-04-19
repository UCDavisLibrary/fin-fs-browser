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

    this.icon = 'radio-button-unchecked';

    // see if it's already loaded.  if so, set
    let state = this.FinFsBrowserModel.store.getMinimalPath(this.path);
    if( state && state.state === 'loaded' ) {
      if( this.FinFsBrowserModel.isBinary(state.payload) ) {
        this.icon = 'editor:insert-drive-file';
      } else {
        this.icon = 'folder';
      }
      return;
    } 

    if( this.updateTimer ) clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(async () => {
      this.updateTimer = null;
      let data = await this.FinFsBrowserModel.getMinimalPath(this.path);
      if( data.id !== this.path ) return;
      if( data.state === 'error' ) {
        return this.icon = 'error';
      }
      if( data.state !== 'loaded' ) return;

      if( this.FinFsBrowserModel.isBinary(data.payload) ) {
        this.icon = 'editor:insert-drive-file';
      } else {
        this.icon = 'folder';
      }
    }, 100);    
  }

}

customElements.define('ffsb-path-icon', FfsbPathIcon);
