import React, { useState } from 'react'

import Preloader from '../atoms/Preloader'
import VerticalCenter from '../atoms/VerticalCenter'
import Icon from '../atoms/Icon'

function CartItem({
  product
}) {
  const [itemUpdating, setItemUpdating] = useState(false)

  const up = async () => {
    let c = product.quantity
    let f = c + 1

    setItemUpdating(true)
    await Permalink.updateQty(product.id, f)
    setItemUpdating(false)
  }

  const down = async () => {
    let c = product.quantity
    let f = c - 1

    setItemUpdating(true)
    await Permalink.updateQty(product.id, f)
    setItemUpdating(false)
  }

  const remove = async () => {
    setItemUpdating(true)
    await Permalink.updateQty(product.id, 0)
    setItemUpdating(false)
  }
  
  return (
    <div className={`pl-cart-item`}>
      <div className='pl-cart-item--image' style={{"backgroundImage": `url(${product.featured_image.url})`}}></div>
      <div className='pl-cart-item--labels'>
        <div className='pl-cart-item--labels--name'>{product.product_title}</div>
        <div className='pl-cart-item--labels--price'>${Permalink.getPrice(product.price)}</div>
      </div>
      <div className='pl-cart-item--actions'>
        <div className='pl-cart-item--actions--qty'>
          <button onClick={down} className='slow_ani'>
            <Icon name="minus" />
          </button>
          <input type="number" readOnly={true} value={product.quantity} />
          <button onClick={up} className='slow_ani'>
            <Icon name="plus" />
          </button>
        </div>
      </div>

      <div className='pl-cart-item--delete' onClick={remove}>
        <Icon name="remove" />
      </div>

      {itemUpdating &&
        <div className='pl-cart-item--overlay'>
          <VerticalCenter>
            <Preloader
              type="section"
              invert
            />
          </VerticalCenter>
        </div>
      }
    </div>
  )
}

export default CartItem