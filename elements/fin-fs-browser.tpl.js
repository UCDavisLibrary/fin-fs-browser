import { html } from 'lit-element';

export default function render() { 
return html`

<style>
  :host {
    display: block;
  }

  ffsb-table-row {
    cursor: pointer;
  }
  h2 {
    display: flex;
    align-items: center;
  }
  .back-btn {
    margin: 10px;
    cursor: pointer;
  }
</style>  

<h2>
  <div .hidden="${this.isRoot}" @click="${this._onBackClicked}" class="back-btn"><iron-icon icon="arrow-back"></iron-icon></div>
  <div>${this.path}</div>
</h2>
<div>
  ${this.children.map(child => 
    html`<ffsb-table-row @click="${this._onChildClicked}" path="${child}"></ffsb-table-row>`
  )}
</div>

`;}