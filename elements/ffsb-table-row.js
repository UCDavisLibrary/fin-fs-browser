import { LitElement } from 'lit-element';
import render from "./ffsb-table-row.tpl.js"

import './ffsb-name-label'
import "./ffsb-path-icon"
import "./ffsb-path-size"

export default class FfsbTableRow extends LitElement {

  static get properties() {
    return {
      path : {type: String}
    }
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.path = '';
  }

}

customElements.define('ffsb-table-row', FfsbTableRow);
