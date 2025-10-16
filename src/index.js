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

// Carrusel de reseñas
function initReviewsCarousel() {
  const carousel = document.querySelector('.reviews-carousel');
  if (!carousel) return;

  const reviewCards = carousel.querySelectorAll('.review-card');
  
  if (reviewCards.length <= 1) return;

  let currentIndex = 0;
  const totalReviews = reviewCards.length;

  function showReview(index) {
    // Ocultar todas las reseñas
    reviewCards.forEach(card => {
      card.classList.remove('active');
    });
    
    // Mostrar la reseña actual
    reviewCards[index].classList.add('active');
    
    // Actualizar paginación en todas las cards
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

  // Inicializar con la primera reseña
  showReview(0);

  // Cambiar reseña cada 4 segundos
  setInterval(nextReview, 4000);

  // Añadir funcionalidad de click en los dots de paginación
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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initReviewsCarousel);