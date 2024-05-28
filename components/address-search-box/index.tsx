import React from "react"

interface SearchProps {}
const index = ({ address, setAddress, handleSearch, loading }: any) => {
  return (
    <div>
      <div className="flex mx-auto md:w-[450px] items-start justify-center h-[80vh] flex-col">
        <div className=" ">
          <div className="text-center ">
            <h1 className="font-semibold md:text-2xl text-xl ">
              Enter User Wallet Address
            </h1>
            <p className="md:text-[16px] text-[12px] text-[#71717A] font-[400] p-2">
              Address will reveal, users purchase nodes, node status, expiry and
              other details per node.
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-5">
            <label className="md:text-[16px] text-[12px]">Wallet Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0xdee...."
              className="px-4 py-2  border rounded-lg bg-transparent border-[##27272A] text-[#727272] "
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default index
