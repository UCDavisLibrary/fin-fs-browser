import { html } from 'lit-element';

export default function render() { 
return html`

<style>
  :host {
    display: inline-block;
  }
</style>  
<span>${this.name}</span>
`;}