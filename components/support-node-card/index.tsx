import React from "react"
import { CoinIcon, EllipsisVertical } from "../icons"

const index = ({ handleAddBalance, data }: any) => {
  return (
    <div>
      <div className="md:w-[358px] w-[270px] h-[232px] bg-[#0D0D0E] rounded-lg p-3  ">
        <div className="flex justify-between items-center p-4">
          <div>
            <label className="block mb-1 text-lg font-semibold text-[#87878A]">
              Balance
            </label>
            <h1 className="text-4xl font-semibold text-[#FFFFFF">
              $ {data.balance}
            </h1>
          </div>
          <div className="bg-[#18181B] p-2 rounded-lg">
            <EllipsisVertical />
          </div>
        </div>
        <div className="flex flex-col justify-end items-end h-1/2 w-full">
          <button
            aria-label="Add Credit"
            className="px-4 py-2 ml-2 bg-[#F44336] flex flex-row gap-3 drop-shadow-sm shadow-[#F4433680] shadow-xl text-white rounded-lg"
            onClick={handleAddBalance}
          >
            <CoinIcon /> Add Credit
          </button>
        </div>
      </div>
    </div>
  )
}

export default index
