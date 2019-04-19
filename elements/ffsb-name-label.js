import { LitElement } from 'lit-element';
import render from "./ffsb-name-label.tpl.js"


export default class FfsbNameLabel extends Mixin(LitElement)
  .with(LitCorkUtils) {

  static get properties() {
    return {
      path : {type: String},
      name : {type: String}
    }
  }

  constructor() {
    super();
    this.render = render.bind(this);

    this.name = '...';
    this.path = '';

    this._injectModel('FinFsBrowserModel');
  }

  update(props) {
    if( props.has('path') ) {
      this._onPathUpdate();
    }
    super.update(props);
  }

  async _onPathUpdate() {
    if( !this.path ) return;

    this.name = '...';

    // see if it's already loaded.  if so, set
    let state = this.FinFsBrowserModel.store.getMinimalPath(this.path);
    if( state && state.state === 'loaded' ) {
      this.name = this.FinFsBrowserModel.getGraphName(state.payload);
      return;
    } 

    if( this.updateTimer ) clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(async () => {
      this.updateTimer = null;

      let data = await this.FinFsBrowserModel.getMinimalPath(this.path);
      if( data.id !== this.path ) return;
      if( data.state === 'error' ) {
        return this.name = 'ERROR';
      }
      if( data.state !== 'loaded' ) return;
      this.name = this.FinFsBrowserModel.getGraphName(data.payload);
    }, 100);
  }

}

customElements.define('ffsb-name-label', FfsbNameLabel);
