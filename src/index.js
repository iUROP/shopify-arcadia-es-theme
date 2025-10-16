import React from 'react'
import ReactDOM from 'react-dom'
import MiniCart from './components/organisms/MiniCart.jsx'
import ProductAddToCart from './components/atoms/ProductAddToCart.jsx'
import ShippingCalculator from './components/organisms/ShippingCalculator.jsx'
import './styles/main.scss'
import './utils/functions.js'
import { initCollectionProductGrid } from './utils/collectionProductGrid.js'


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


class AddToCartElement extends HTMLElement {
  static get observedAttributes() { 
    return ['blocks']
  }

  constructor() {
    super()
    this.state = {
      text: null,
      variant: null
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'blocks') {
      let arrBlocks = newValue
      if (arrBlocks) arrBlocks = arrBlocks.split('|')

      this.state.text = arrBlocks[0] ? arrBlocks[0] : null;
      this.state.variant = arrBlocks[1] ? arrBlocks[1] : null;
    }
  }

  connectedCallback() {
    
    ReactDOM.render(<ProductAddToCart text={this.state.text} variantId={this.state.variant} />, this);
  }
}

customElements.define("i-add-to-cart", AddToCartElement)


class ShippingCalculatorElement extends HTMLElement {
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
    
    ReactDOM.render(<ShippingCalculator blocks={this.state.blocks} />, this);
  }
}

customElements.define("i-shipping-calculator", ShippingCalculatorElement)

initCollectionProductGrid()

function initReviewsCarousel() {
  const carousel = document.querySelector('.reviews-carousel');
  if (!carousel) return;

  const reviewCards = carousel.querySelectorAll('.review-card');
  
  if (reviewCards.length <= 1) return;

  let currentIndex = 0;
  const totalReviews = reviewCards.length;

  function showReview(index) {
    reviewCards.forEach(card => {
      card.classList.remove('active');
    });
    
    // Mostrar la reseña actual
    reviewCards[index].classList.add('active');
    
    reviewCards.forEach((card, cardIndex) => {
      const paginationDots = card.querySelectorAll('.pagination-dot');
      paginationDots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
      });
    });
  }

  function nextReview() {
    currentIndex = (currentIndex + 1) % totalReviews;
    showReview(currentIndex);
  }

  showReview(0);

  // Cambiar reseña cada 4 segundos
  setInterval(nextReview, 4000);

  reviewCards.forEach((card, cardIndex) => {
    const paginationDots = card.querySelectorAll('.pagination-dot');
    paginationDots.forEach((dot, dotIndex) => {
      dot.addEventListener('click', () => {
        currentIndex = dotIndex;
        showReview(currentIndex);
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initReviewsCarousel);