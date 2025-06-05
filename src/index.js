import React from 'react'
import ReactDOM from 'react-dom'
import MiniCart from './components/organisms/MiniCart.jsx'
import './styles/main.scss'
import './utils/functions.js'

class MiniCartElement extends HTMLElement {
  static get observedAttributes() { 
    return ['blocks']
  }

  constructor() {
    super()
    this.state = {
      blocks: null
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {

    if (name === 'blocks') {
      this.state.blocks = newValue ? newValue : null;
    }
  }

  connectedCallback() {
    
    ReactDOM.render(<MiniCart blocks={this.state.blocks} />, this);
  }
}

customElements.define("i-minicart", MiniCartElement)