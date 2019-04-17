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

    this._injectModel('FinFsBrowserModel');
  }

  update(props) {
    if( props.has('path') ) {
      this._onPathUpdate();
    }
    super.update(props);
  }

  async _onPathUpdate() {
    this.name = '...';
    let data = await this.FinFsBrowserModel.getPath(this.path);
    if( data.state === 'error' ) {
      return this.name = 'ERROR';
    }
    this.name = this.FinFsBrowserModel.getGraphName(data.payload);
  }

}

customElements.define('ffsb-name-label', FfsbNameLabel);
