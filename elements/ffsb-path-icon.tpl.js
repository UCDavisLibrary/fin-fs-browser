import { html } from 'lit-element';

export default function render() { 
return html`

<style>
  :host {
    display: inline-block;
  }
</style>  

<iron-icon icon="${this.icon}"></iron-icon>
`;}