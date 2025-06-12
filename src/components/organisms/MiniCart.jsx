import React, { useState, useEffect } from 'react'
import Slider from "react-slick"

import Icon from '../atoms/Icon'
import VerticalCenter from '../atoms/VerticalCenter'
import CartItem from '../molecules/CartItem'

function MiniCart({
  blocks
}) {
  const [cartQty, setCartQty] = useState(false)
  const [lineItems, setLineItems] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [cartTotal, setCartTotal] = useState(0)

  useEffect(() => {
    async function get() {
      const cart = await Permalink.getCart()
      const items =  []
      if (cart && cart.items) {

        for (const item of cart.items) {
          const handle = item.handle;
          const product = await fetch(`/products/${handle}.js`).then(res => res.json());
          if (product) {
            const variant = product.variants.find(v => v.id === item.variant_id);

            if (variant) {
              item['compare_at_price'] = variant.compare_at_price
            }
          }
          items.push(item);
        }
        
        setLineItems(items)
      }

      setCartQty(cart.item_count)
      setCartTotal(cart.total_price)
      console.log("cart info", cart)
    }
    get()

    window.addEventListener('cartUpdate', function() {
      get()
    })

    window.addEventListener('cartToggle', function() {
      setShowCart(!showCart)
    })
  }, [])

  useEffect(() => {
    if (showCart) {
      document.querySelector('body').classList.add('open-cart')
    } else {
      document.querySelector('body').classList.remove('open-cart')
    }
  }, [showCart])
  
  const cartToggler = () => {
    setShowCart(!showCart)
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    centerPadding: '20px',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      }
    ]
  }

  const list = [
    {
      "title": " 90 Days Money back guarentee",
      "icon": false
    }
  ]

  return (
    <div className={`i-minicart-container`}>
      <VerticalCenter>
        <div onClick={cartToggler}>
          <Icon name="cart" />
        </div>
      </VerticalCenter>
      {/* {cartQty &&
        <strong>{cartQty}</strong>
      } */}
      <div className={`i-minicart-container__snap slow_ani ${showCart ? 'open' : ''}`}>
        <div className='i-minicart-container__snap--header'>
          <VerticalCenter>
            <h2>
              Tu carrito
              <span>{cartQty && <>({cartQty})</>}</span>
            </h2>
          </VerticalCenter>
          <button onClick={cartToggler} className='i-minicart-container__snap--header__close slow_ani'>
            <Icon name="close" />
          </button>
        </div>
        <div className='i-minicart-container__snap--deals'>

          <Slider {...settings}>
            {list.map((deal, index) => {

              return (
                <div key={index} className='i-minicart-container__snap--deals--deal'>
                  <VerticalCenter>
                    {deal.title}
                  </VerticalCenter>
                </div>
              )
            })}
          </Slider>
        </div>
        <div className='i-minicart-container__snap--items'>
          {lineItems
            ? lineItems.length > 0
              ? lineItems.map((item, index) => {
                  return (
                    <CartItem product={item} key={index} />
                  )
                })
              : <div className='empty-cart-state'>Carrito vacio</div>
            : <>Cargando items...</>
          }
        </div>
        <div className='i-minicart-container__snap--footer'>
          <div className='i-minicart-container__snap--footer__subtotals'>
            <div className='i-minicart-container__snap--footer__subtotals--row'>
              <div className='i-minicart-container__snap--footer__subtotals--row__key'>Shipping Cost</div>
              <div className='i-minicart-container__snap--footer__subtotals--row__value'>
                <strong>Free</strong>
              </div>
            </div>
            <div className='i-minicart-container__snap--footer__subtotals--row'>
              <div className='i-minicart-container__snap--footer__subtotals--row__key'>Subtotal</div>
              <div className='i-minicart-container__snap--footer__subtotals--row__value'>€{Permalink.getPrice(cartTotal)}</div>
            </div>
          </div>
          <div className='i-minicart-container__snap--footer__actions'>
            <a href="/checkout">Comprar miel</a>
          </div>
          <div className='i-minicart-container__snap--footer__cards'>
            <Icon name="footer-cards" />
          </div>
        </div>
      </div>
      <div className={`i-minicart-container__overlay slow_ani ${showCart ? 'open' : ''}`} onClick={cartToggler}></div>
    </div>
  )
}

export default MiniCart