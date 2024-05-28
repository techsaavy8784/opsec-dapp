import { X } from "lucide-react"
import React from "react"

const Index = ({
  setShowBalanceModal,
  balanceInput,
  setBalanceInput,
  handleBalanceSubmit,
}: any) => {
  return (
    <>
      <div className="fixed inset-0 bg-[#09090B] bg-opacity-50 flex justify-center items-center">
        <div className="md:w-full w-3/4 md:max-w-lg max-w-36 bg-[#18181B] p-6 md:p-8 rounded-lg mx-auto">
          <div className="flex justify-end">
            <button title="Close" onClick={() => setShowBalanceModal(false)}>
              <X className="bg-[#777777] rounded-full w-5 h-5 p-1" />
            </button>
          </div>

          <h2 className="md:text-xl text-md font-bold mb-4 text-center">
            Add Credit
          </h2>
          <div className="flex flex-col gap-6">
            <label htmlFor="balance-amount">Amount</label>
            <input
              id="balance-amount"
              aria-label="Amount"
              type="number"
              value={balanceInput}
              onChange={(e) => setBalanceInput(Number(e.target.value))}
              className="px-4 py-2 border rounded-lg bg-transparent border-[#27272A] text-[#727272] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={handleBalanceSubmit}
              className="px-4 py-2 bg-red-500 rounded-lg"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Index
