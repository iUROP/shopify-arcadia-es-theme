import React, { useState, useEffect } from 'react'
import Slider from "react-slick"

import Icon from '../atoms/Icon'
import VerticalCenter from '../atoms/VerticalCenter'
import CartItem from '../molecules/CartItem'

function MiniCart({
  blocks
}) {
  const [reservationTime, setReservationTime] = useState('10:00')
  const [cartQty, setCartQty] = useState(0)
  const [lineItems, setLineItems] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [cartTotal, setCartTotal] = useState(0)
  const [cartSubtotal, setCartSubtotal] = useState(0)
  const [cartDiscounts, setCartDiscounts] = useState([])
  const [freeShippingAmount, setFreeShippingAmount] = useState(0)
  const [freeShippingPercent, setFreeShippingPercent] = useState(0)

  const RESERVATION_KEY = 'cart_reservation_time'
  const RESERVATION_DURATION = 10 * 60 * 1000

  useEffect(() => {
    let interval;
    if (showCart && lineItems && lineItems.length > 0) {
      let endTime = localStorage.getItem(RESERVATION_KEY);
      if (!endTime) {
        endTime = Date.now() + RESERVATION_DURATION;
        localStorage.setItem(RESERVATION_KEY, endTime.toString());
      } else {
        endTime = parseInt(endTime);
      }

      const updateTimer = () => {
        const now = Date.now();
        const distance = endTime - now;
        if (distance < 0) {
          setReservationTime('00:00');
          clearInterval(interval);
          return;
        }
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setReservationTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      };

      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      if (lineItems && lineItems.length === 0) {
        localStorage.removeItem(RESERVATION_KEY);
      }
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showCart, lineItems]);

  useEffect(() => {
    async function get() {
      console.log("Re run cart")
      const cart = await Permalink.getCart()
      const items = []
      if (cart && cart.items) {
        for (const item of cart.items) {
          const handle = item.handle;
          try {
            const product = await fetch(`/products/${handle}.js`).then(res => res.json());
            if (product) {
              const variant = product.variants.find(v => v.id === item.variant_id);
              if (variant) {
                item['compare_at_price'] = variant.compare_at_price
              }
            }
          } catch (e) { }
          items.push(item);
        }
        setLineItems(items)
      }

      setCartQty(cart.item_count)
      setCartTotal(cart.total_price)
      setCartSubtotal(cart.items_subtotal_price)
      setCartDiscounts(cart.cart_level_discount_applications || [])

      let blocksSplit = blocks.split('|')
      let threshold = Number(blocksSplit[0])
      let currentTotalInEuros = cart.total_price / 100
      let freeShipping = threshold - currentTotalInEuros
      let freePercent = Math.min((currentTotalInEuros / threshold) * 100, 100)

      setFreeShippingAmount(freeShipping)
      setFreeShippingPercent(freePercent)
    }
    get()

    window.addEventListener('cartUpdate', function () {
      get()
    })

    window.addEventListener('cartToggle', function () {
      setShowCart(prev => !prev)
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
      "title": "Envío gratis a todo el mundo en pedidos a partir de 65 €.",
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

      <div className={`i-minicart-container__snap slow_ani ${showCart ? 'open' : ''} ${lineItems && lineItems.length === 0 ? 'empty-cart' : ''}`}>
        <div className='i-minicart-container__snap--header'>
          <VerticalCenter>
            <h2>
              Carrito
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

        <div className='i-minicart-container__snap--freeShipping'>
          <div className='i-minicart-container__snap--freeShipping--labels Text-Colors-500 Family-Font---Body Typo-Body-S'>
            <Icon name="shipping" />
            {freeShippingAmount <= 0
              ? <>¡Ahora tienes envio gratuito!</>
              : <>¡Gasta {window.Permalink.getPrice(freeShippingAmount)} más y obtén envío gratis!</>
            }
          </div>
          <div className='i-minicart-container__snap--freeShipping--bar'>
            <div className='i-minicart-container__snap--freeShipping--bar__progress slow_ani' style={{ width: `${freeShippingPercent}%` }}></div>
          </div>
        </div>

        <div className='i-minicart-container__snap--items'>
          {lineItems
            ? lineItems.length > 0
              ? lineItems.map((item, index) => {
                return (
                  <CartItem product={item} key={index} />
                )
              })
              : <div className='empty-cart-state'>
                <div>Nada de miel por aquí...</div>
                <div className='i-minicart-container__snap--footer__actions'>
                  <a href="/collections/all" className='is-button-hover-primary'>Comprar miel</a>
                </div>
              </div>
            : <div className='loading-cart-state'>Cargando carrito...</div>
          }
        </div>

        {lineItems && lineItems.length > 0 && (
          <div className='cart-drawer-footer'>
            <div className="cart-footer-subtotal">
              <span className="cart-footer-subtotal-label">SUBTOTAL:</span>
              <span id="cart-subtotal">{Permalink.getPrice(cartSubtotal / 100)}</span>
            </div>

            {cartDiscounts && cartDiscounts.length > 0 && (
              <div className="cart-footer-discounts">
                {cartDiscounts.map((discount, index) => (
                  <div key={index} className="cart-footer-discount">
                    <span className="cart-footer-discount-label">{discount.title}:</span>
                    <span className="cart-footer-discount-amount">-{Permalink.getPrice(discount.total_allocated_amount / 100)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="cart-footer-total">
              <span className="cart-footer-total-label">TOTAL:</span>
              <span id="cart-total">{Permalink.getPrice(cartTotal / 100)}</span>
            </div>

            <p id="reservation-message">
              {reservationTime === '00:00'
                ? <span style={{ color: '#C10007', fontWeight: '600' }}>¡Date prisa! Tu tiempo ha expirado, última oportunidad.</span>
                : <>Reservamos tu pedido <span id="reservation-timer">{reservationTime}</span> min. por alta demanda.</>
              }
            </p>

            <a href="/checkout" className="cart-footer-button">
              <span>Pago seguro</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3.55716 15.7039C3.74456 17.0958 4.89743 18.1862 6.30037 18.2507C7.48088 18.305 8.68007 18.3333 10.0007 18.3333C11.3212 18.3333 12.5204 18.305 13.7009 18.2507C15.1039 18.1862 16.2567 17.0958 16.4442 15.7039C16.5665 14.7956 16.6673 13.8647 16.6673 12.9167C16.6673 11.9687 16.5665 11.0378 16.4442 10.1294C16.2567 8.7375 15.1039 7.64707 13.7009 7.58257C12.5204 7.52831 11.3212 7.5 10.0007 7.5C8.68007 7.5 7.48088 7.52831 6.30037 7.58257C4.89743 7.64707 3.74456 8.7375 3.55716 10.1294C3.43485 11.0378 3.33398 11.9687 3.33398 12.9167C3.33398 13.8647 3.43485 14.7956 3.55716 15.7039Z" stroke="white" strokeWidth="1.5" />
                <path d="M6.25 7.50033V5.41699C6.25 3.34593 7.92893 1.66699 10 1.66699C12.0711 1.66699 13.75 3.34593 13.75 5.41699V7.50033" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <div className='i-minicart-container__snap--footer__cards'>
              <Icon name="footer-cards" />
            </div>
          </div>
        )}
      </div>
      <div className={`i-minicart-container__overlay slow_ani ${showCart ? 'open' : ''}`} onClick={cartToggler}></div>
    </div>
  )
}

export default MiniCart