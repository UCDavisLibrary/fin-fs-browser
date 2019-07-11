import { html } from 'lit-element';

export default function render() { 
return html`

<style>
  :host {
    display: block;
    height: 300px;
  }

  .root {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  #scroll-panel {
    position: relative;
  }

  .virtual-item {
    position: absolute;
    width: 100%;
  }

  [hidden] {
    display: none;
  }
</style>  

<div class="root" @scroll="${this._onScroll}">
  <div id="scroll-panel" ?hidden="${this.loading}"></div>
</div>
`;}