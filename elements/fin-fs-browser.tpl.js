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

  ffsb-virtual-list {
    border: 1px solid #ccc;
  }
</style>  

<h2>
  <div .hidden="${this.isRoot}" @click="${this._onBackClicked}" class="back-btn"><iron-icon icon="arrow-back"></iron-icon></div>
  <div>${this.path}</div>
</h2>


<ffsb-virtual-list 
  .loading="${this.loading}"
  .items="${this.children}" 
  assignItemProp="path"
  .createItemElement="${this.createListElement}">
</ffsb-virtual-list>

`;}