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

  useEffect(() => {
    async function get() {
      const cart = await Permalink.getCart()
      if (cart && cart.items) setLineItems(cart.items)

      setCartQty(cart.item_count)
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
    dots: true,
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
          infinite: true,
          dots: true
        }
      }
    ]
  }

  const list = [
    {
      "title": "100% secure purchase",
      "icon": "mi icon url"
    },
    {
      "title": "mi title 2",
      "icon": "mi icon url 2"
    }
  ]

  return (
    <div className={`pl-minicart-container`}>
      <VerticalCenter>
        <div onClick={cartToggler}>
          <Icon name="cart" />
        </div>
      </VerticalCenter>
      {/* {cartQty &&
        <strong>{cartQty}</strong>
      } */}
      <div className={`pl-minicart-container__snap slow_ani ${showCart ? 'open' : ''}`}>
        <div className='pl-minicart-container__snap--header'>
          <VerticalCenter>
            <h2>Carrito {cartQty && <>({cartQty})</>}</h2>
          </VerticalCenter>
          <button onClick={cartToggler} className='pl-minicart-container__snap--header__close slow_ani'>
            <Icon name="close" />
          </button>
        </div>
        <div className='pl-minicart-container__snap--deals'>

          <Slider {...settings}>
            {list.map((deal, index) => {

              return (
                <div key={index} className='pl-minicart-container__snap--deals--deal'>
                  <VerticalCenter>
                    {deal.title}
                  </VerticalCenter>
                </div>
              )
            })}
          </Slider>
        </div>
        <div className='pl-minicart-container__snap--items'>
          {lineItems
            ? lineItems.length > 0
              ? lineItems.map((item, index) => {
                  return (
                    <CartItem product={item} key={index} />
                  )
                })
              : <>Carrito vacio</>
            : <>Cargando items...</>
          }
        </div>
        <div className='pl-minicart-container__snap--footer'>
          <div className='pl-minicart-container__snap--footer__freeshipping'>
            footer
          </div>
          <div className='pl-minicart-container__snap--footer__actions'>
            footer
          </div>
        </div>
      </div>
      <div className={`pl-minicart-container__overlay slow_ani ${showCart ? 'open' : ''}`} onClick={cartToggler}></div>
    </div>
  )
}

export default MiniCart