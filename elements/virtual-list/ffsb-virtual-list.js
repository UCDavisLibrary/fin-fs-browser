import { LitElement } from 'lit-element';
import render from "./ffsb-virtual-list.tpl.js"

export default class FfsbVirtualList extends LitElement {

  static get properties() {
    return {
      maxHeight : {type: Array},
      items : {type: Array},
      renderedItems : {type: Array},
      assignItemProp : {type: String},
      itemHeight : {type : Number}
    }
  }

  constructor() {
    super();
    this.render = render.bind(this);

    let tmp = [];
    for( let i = 0; i < 100; i++ ) {
      tmp.push(i);
    }

    this.items = tmp;


    this.assignItemProp = 'innerHTML';
    this.itemHeight = 50;
    this.renderedItems = [];
    this.trash = [];
  }


  update(props) {
    super.update(props);
  }

  firstUpdated() {
    this.scrollPanel = this.shadowRoot.querySelector('#scroll-panel');
    this.root = this.shadowRoot.querySelector('.root');

    this.height = this.offsetHeight;
    let numEle = Math.ceil(this.height / this.itemHeight);
    for( let i = 0; i < numEle; i++ ) {
      let ele = this._createElement();
      ele[this.assignItemProp] = this.items[i];
      this.renderedItems.push({
        index : i,
        ele
      });
    }

    this._layoutItems();
  }

  createItemElement() {
    return document.createElement('div');
  }

  _createElement() {
    let ele = this.createItemElement();
    ele.style.height = this.itemHeight;
    ele.className = 'virtual-item';
    this.scrollPanel.appendChild(ele);
    return ele;
  }

  updated() {
    this.scrollPanel.style.height = this.items.length*this.itemHeight;
  }

  _onScroll(e) {
    this._layoutItems();
  }

  _layoutItems() {
    let scrollTop = this.root.scrollTop;
    let topEle = Math.floor(scrollTop / this.itemHeight);
    let numEle = Math.ceil(this.height / this.itemHeight);

    for( let i = 0; i < this.renderedItems.length; i++ ) {
      let item = this.renderedItems[i];
      if( item.index < topEle || item.index > topEle+numEle ) {
        this.renderedItems.splice(i, 1);
        this.trash.push(item);
        this.scrollPanel.removeChild(item.ele);
      }
    }

    for( let i = topEle; i < topEle+numEle; i++ ) {
      if( i >= this.items.length ) continue;
      let item = this.renderedItems.find(item => item.index === i);
      if( item ) continue;

      if( this.trash.length ) {
        item = this.trash.pop();
        this.scrollPanel.appendChild(item.ele);
      } else {
        item = {index : i, ele: this._createElement()};
      }

      item.index = i;
      item.ele[this.assignItemProp] = this.items[i];
      this.renderedItems.push(item);
    }

    for( let item of this.renderedItems ) {
      item.ele.style.top = item.index*this.itemHeight;
    }
  }

}

customElements.define('ffsb-virtual-list', FfsbVirtualList);
