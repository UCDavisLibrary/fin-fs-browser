import { html } from 'lit-element';

export default function render() { 
return html`

<style>
  :host {
    display: block;
    height: 25px;
    cursor: pointer;
  }
  :host(:hover) {
    background-color: #f8f8f8;
  }
  .layout {
    display: flex;
    align-items: center;
  }
</style>  

<div class="layout">
  <ffsb-path-icon path="${this.path}"></ffsb-path-icon>
  <ffsb-name-label path="${this.path}"></ffsb-name-label>
  <div style="flex:1"></div>
  <ffsb-path-size path="${this.path}"></ffsb-path-size>
</div>

`;}