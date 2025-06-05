window.Permalink = function() {
  const init = function() {
    console.log("Init Permalink Theme Functions!")

    stickyMenu()
    setupHeader()

  } // init

  const getCart = async function(openCart) {
    return new Promise(async (resolve) => {

      const request = await fetch(`/cart.js`, {
        method: "GET"
      })

      resolve(await request.json())
    })
  }

  const getProduct = async function() {

    return new Promise((resolve) => {

      resolve("getProduct!")
    })
  }

  const getCollection = async function() {

    return new Promise((resolve) => {

      resolve("getCollection!")
    })
  }

  const addItems = async function(items, open) {
    return new Promise(async (resolve) => {

      const request = await fetch(`/cart/add.js`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: items })
      })

      resolve(await request.json())

      if (open) openCart()
      reactive()
    })
  }

  const updateItems = async function() {

    return new Promise((resolve) => {

      resolve("updateItems!")
    })
  }

  const updateQty = function(id, quantity) {

    return new Promise(async (resolve) => {

      const request = await fetch(`/cart/change.js`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id.toString(), quantity })
      })

      resolve(await request.json())

      reactive()
    })
  }

  const updateNote = async function() {

    return new Promise((resolve) => {

      resolve("updateNote!")
    })
  }

  const updateAttributes = async function() {

    return new Promise((resolve) => {

      resolve("updateAttributes!")
    })
  }

  const removeItems = async function() {

    return new Promise((resolve) => {

      resolve("removeItems!")
    })
  }

  const openCart = function(){
    window.dispatchEvent(new CustomEvent('cartToggle', {
      detail: {
        message: 'Cart is toggle'
      }
    }))
  }

  const reactive = function() {
    window.dispatchEvent(new CustomEvent('cartUpdate', {
      detail: {
        message: 'Cart is updated'
      }
    }))
  }

  const openMenu = function() {
    const el = document.querySelector('body')
    const target = document.querySelector('body.open-menu')
    const scroll = window.scrollY
    
    if (!target) {
      el.classList.add('open-menu')
    } else {
      el.classList.remove('open-menu')
    }

    setTimeout( () => {
      document.querySelector('.pl-header-menu__content--items__item .item-details').classList.remove('open')
      document.querySelector('.pl-header-menu__content--items__item--submenu--items__item .item-details').classList.remove('open')
    }, 10 )
  }

  const stickyMenu = function() {
    let actualScroll = 0
    let lastScrollTop = 0
    const header = document.querySelector('.section-header')
    const body = document.querySelector('body')

    window.addEventListener("scroll", function() {
      const top = Math.min(-(window.scrollY - actualScroll + header.clientHeight), 0)
      if (window.scrollY  > actualScroll) {
        actualScroll = window.scrollY
      }

      if (top === 0) {
        actualScroll = window.scrollY + header.clientHeight
      }

      header.setAttribute("style", `--_top:${top}px`);
      header.classList.toggle('sticky',window.scrollY < actualScroll)
      header.classList.toggle('clr',window.scrollY > header.clientHeight * 1.5)


      let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScroll > lastScrollTop) {
        body.classList.add('scrolled')
      } else {
        body.classList.remove('scrolled')
      }

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;

  }, false);
  }

  const setupHeader = function() {
    const bar = document.querySelector('.announcement-bar-section')
    const header = document.querySelector('.pl-header-container')

    // better
    document.querySelector('.pl-header-menu__content--items__item .item-details').addEventListener("click", function(){
      document.querySelector('.pl-header-menu__content--items__item .item-details').classList.add('open')
    })
    document.querySelector('.pl-header-menu__content--items__item--submenu--items__item .item-details').addEventListener("click", function(){
      document.querySelector('.pl-header-menu__content--items__item--submenu--items__item .item-details').classList.add('open')
    })
    document.querySelector('.pl-header-menu__content--items__item--back').addEventListener("click", function(){
      setTimeout( () => {
        document.querySelector('.pl-header-menu__content--items__item .item-details').classList.remove('open')
      }, 10 )
    })
    document.querySelector('.pl-header-menu__content--items__subitem--back').addEventListener("click", function(){
      setTimeout( () => {
        document.querySelector('.pl-header-menu__content--items__item--submenu--items__item .item-details').classList.remove('open')
      }, 10 )
    })

    document.addEventListener('click', (event) => {
      
      if (!event.target.closest('.pl-header-menu')) {
        document.querySelector('.pl-header-menu__content--items__item .item-details').classList.remove('open')
        document.querySelector('.pl-header-menu__content--items__item--submenu--items__item .item-details').classList.remove('open')
      }

      if (window.innerWidth > 990) {
        if (event.target.tagName == 'SUMMARY' || event.target.tagName == 'path' || event.target.tagName == 'svg') {

        }
      }
    })
  }

  const getPrice = function(number) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  
    return formatter.format(number).replace(',','.').replace('$','')
  }

  return {
    init,
    getCart,
    getProduct,
    getCollection,
    addItems,
    updateItems,
    updateQty,
    updateNote,
    updateAttributes,
    removeItems,
    openCart,
    reactive,

    openMenu,
    stickyMenu,
    setupHeader,
    getPrice
  }
}();
Permalink.init()