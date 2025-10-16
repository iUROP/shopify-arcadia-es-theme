export class CollectionProductGrid {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');

    if (priceFilter) {
      priceFilter.addEventListener('change', (e) => {
        this.handlePriceFilter(e.target.value);
      });
    }

    if (sortFilter) {
      sortFilter.addEventListener('change', (e) => {
        this.handleSortFilter(e.target.value);
      });
    }
  }

  handlePriceFilter(value) {
    const products = Array.from(document.querySelectorAll('.i-collection-product-grid__card'));
    
    products.sort((a, b) => {
      const priceA = this.getProductPrice(a);
      const priceB = this.getProductPrice(b);
      
      return value === 'price-asc' ? priceA - priceB : priceB - priceA;
    });

    this.reorderProducts(products);
  }

  handleSortFilter(value) {
    const products = Array.from(document.querySelectorAll('.i-collection-product-grid__card'));
    
    products.sort((a, b) => {
      switch (value) {
        case 'manual':
        case 'created-descending':
          return 0; // Mantener orden original
        case 'best-selling':
          return this.getProductSales(b) - this.getProductSales(a);
        case 'title-ascending':
          return this.getProductTitle(a).localeCompare(this.getProductTitle(b));
        case 'title-descending':
          return this.getProductTitle(b).localeCompare(this.getProductTitle(a));
        case 'price-ascending':
          return this.getProductPrice(a) - this.getProductPrice(b);
        case 'price-descending':
          return this.getProductPrice(b) - this.getProductPrice(a);
        case 'created-ascending':
          return 0; // Mantener orden original
        default:
          return 0;
      }
    });

    this.reorderProducts(products);
  }

  getProductPrice(productCard) {
    const priceElement = productCard.querySelector('.i-collection-product-grid__price--sale, .i-collection-product-grid__price');
    if (!priceElement) return 0;
    
    const priceText = priceElement.textContent.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(priceText) || 0;
  }

  getProductTitle(productCard) {
    const titleElement = productCard.querySelector('.i-collection-product-grid__card-title');
    return titleElement ? titleElement.textContent.trim() : '';
  }

  getProductSales(productCard) {
    return Math.random() * 100;
  }

  reorderProducts(products) {
    const grid = document.querySelector('.i-collection-product-grid__grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    products.forEach(product => {
      grid.appendChild(product);
    });
  }
}

export function initCollectionProductGrid() {
  document.addEventListener('DOMContentLoaded', () => {
    new CollectionProductGrid();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new CollectionProductGrid();
    });
  } else {
    new CollectionProductGrid();
  }
}
