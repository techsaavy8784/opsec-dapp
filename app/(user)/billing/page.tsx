import React from "react"
import CreditHistory from "./credits"
import BillingHistory from "./billing"

const Component = () => {
  return (
    <div className="p-6 max-md:w-screen overflow-hidden">
      <BillingHistory />
      <CreditHistory />
    </div>
  )
}

export default Component
