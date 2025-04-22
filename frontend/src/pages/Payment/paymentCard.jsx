import React from 'react'

export const PaymentCard = ({ amount, img, checkoutHandler }) => {
    return (
        <div>
            <img src={img}/>
            <h2>₹{amount}</h2>
            <button onClick={() => checkoutHandler(amount)}>Buy Now</button>
            </div>
    )
}