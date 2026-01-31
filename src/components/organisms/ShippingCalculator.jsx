import React, { useState, useEffect } from 'react'
import Icon from '../atoms/Icon'

function ShippingCalculator({
  blocks
}) {
  const [currentDay, setCurrentDay] = useState(false);
  const [shippingStart, setShippingStart] = useState(false);
  const [nextDay, setNextDay] = useState(false);
  const [deliveryDay, setDeliveryDay] = useState(false);
  const [limitDay, setLimitDay] = useState(false);
  const [limitPreDay, setLimitPreDay] = useState(false);
  const [beforeNextDay, setBeforeNextDay] = useState('');
  const endDayHour = 14;

  useEffect(() => {
    const date = new Date();
    const formatDate = (d) => {
      const monthLabel = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(d).toUpperCase();
      return `${monthLabel} ${d.getDate()}`;
    };

    const formatDateSimply = (d) => {
      const monthLabel = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(d);
      return `${d.getDate()} de ${monthLabel}`;
    };

    let moreTime = 0;
    if (date.getHours() >= endDayHour) {
      moreTime = 1;
    }

    // Pedido (Hoy)
    setCurrentDay(formatDate(date));

    // Envío (Desde)
    const shipStart = new Date(date);
    shipStart.setDate(date.getDate() + moreTime);
    setShippingStart(formatDate(shipStart));

    // Envío (Hasta)
    const shipEnd = new Date(date);
    shipEnd.setDate(date.getDate() + moreTime + 1);
    setNextDay(formatDate(shipEnd));

    // Entregado
    const deliver = new Date(date);
    deliver.setDate(date.getDate() + moreTime + 2);
    setDeliveryDay(formatDate(deliver));

    // Recibe tu paquete entre el (Milestone 1)
    setLimitPreDay(formatDateSimply(deliver));

    // Recibe tu paquete entre el (Milestone 2)
    const limit = new Date(date);
    limit.setDate(date.getDate() + moreTime + 3);
    setLimitDay(formatDateSimply(limit));


    const counter = () => {
      const dateReact = new Date()
      let targetTime = new Date(dateReact);
      targetTime.setHours(endDayHour, 0, 0, 0);

      if (dateReact >= targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      const diff = targetTime - dateReact;

      let totalSegs = Math.floor(diff / 1000);
      let hours = String(Math.floor(totalSegs / 3600)).padStart(2, '0');
      let mins = String(Math.floor((totalSegs % 3600) / 60)).padStart(2, '0');
      let segs = String(totalSegs % 60).padStart(2, '0');

      setBeforeNextDay(
        `${hours} horas ${mins} minutos ${segs} segundos`
      );
    }

    counter();
    setInterval(counter, 1000);

  }, [])

  return (
    <div className={`i-shipping-calculator`}>
      <div className='i-shipping-calculator__char'>
        <div className='i-shipping-calculator__char--item'>
          <Icon name="ship-bag" />
          <h3>Pedido</h3>
          <p>{currentDay}</p>
        </div>
        <div className='i-shipping-calculator__char--separator'><Icon name="ship-arrow" /></div>
        <div className='i-shipping-calculator__char--item'>
          <Icon name="ship-car" />
          <h3>Envío</h3>
          <p>{shippingStart} - {nextDay}</p>
        </div>
        <div className='i-shipping-calculator__char--separator'><Icon name="ship-arrow" /></div>
        <div className='i-shipping-calculator__char--item'>
          <Icon name="ship-location" />
          <h3>Entregado</h3>
          <p>{deliveryDay}</p>
        </div>
      </div>
      <div className='i-shipping-calculator__labels'>
        <div>Haz tu pedido en las próximas <span>{beforeNextDay}</span></div>
        <div>y  recibe tu paquete entre el <span>{limitPreDay} y el {limitDay}.</span></div>
      </div>
    </div>
  )
}

export default ShippingCalculator