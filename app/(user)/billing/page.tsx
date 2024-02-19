import React from "react"
import CreditHistory from "./credits"
import BillingHistory from "./billing"

const Component = () => {
  return (
    <div className="p-6 max-md:w-screen overflow-hidden">
      <div>
        <CreditHistory />
      </div>
      <div className="mt-8">
        <BillingHistory />
      </div>
    </div>
  )
}

export default Component
