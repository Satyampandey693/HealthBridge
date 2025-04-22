import React from 'react'
import { useSearchParams } from "react-router-dom"
export const PaymentSuccess = () => {

    const seachQuery = useSearchParams()[0]

    //const referenceNum = seachQuery.get("reference")
    return (
        <h1>Payment Successful</h1>
    )
}
