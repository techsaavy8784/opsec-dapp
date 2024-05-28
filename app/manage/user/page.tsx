"use client"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import SupportNodeCard from "@/components/support-node-card"
import AddressSearchBox from "@/components/address-search-box"
import AddCredit from "@/components/add-credit"
import { CircleDollarSign, RefreshCw, X } from "lucide-react"

export default function Home() {
  const [address, setAddress] = useState("")
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showBalanceModal, setShowBalanceModal] = useState(false)
  const [balanceInput, setBalanceInput] = useState(0)
  const [creditsPage, setCreditsPage] = useState(1)
  const [nodesPage, setNodesPage] = useState(1)
  const [expandedPayments, setExpandedPayments] = useState<number | null>(null)
  const [searchedData, setSearchedData] = useState<any>(false)
  const [newAddress, setNewAddress] = useState<any>("")
  const itemsPerPage = 5
  const { toast } = useToast()

  const fetchDataAndUpdate = async (
    url: string,
    successToast: any,
    errorToast: any,
  ) => {
    setLoading(true)
    try {
      const response = await fetch(url)
      const result = await response.json()
      setData(result)
      toast({ title: successToast })
    } catch (err) {
      toast({ title: errorToast })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      const url = `/api/manage/user/fetch?address=${address || newAddress}`
      await fetchDataAndUpdate(url, "User Found", "Error Searching User")
      setSearchedData(true)
    } catch (e) {
      toast({ title: "Search failed" })
      throw new Error()
    }
  }

  const handleAddBalance = () => {
    setShowBalanceModal(true)
  }

  const handleBalanceSubmit = async () => {
    try {
      const response = await fetch("/api/manage/user/credit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: data?.id,
          balance: data?.balance,
          balanceCredited: balanceInput,
        }),
      })
      const result = await response.json()
      if (response.ok) {
        setData((prevData: any) => ({
          ...prevData,
          balance: prevData.balance + balanceInput,
        }))
        toast({ title: "Successfully Added Credit" })
      } else {
        throw new Error(result.error || "An unknown error occurred")
      }
      setShowBalanceModal(false)
    } catch (e) {
      toast({ title: "Update failed" })
      throw new Error()
    }
  }

  const handleMoreCredits = () => {
    setCreditsPage((prevPage) => prevPage + 1)
  }

  const handleMoreNodes = () => {
    setNodesPage((prevPage) => prevPage + 1)
  }

  const handleNodeStatusChange = (index: number, newStatus: string) => {
    setData((prevData: any) => {
      const updatedNodes = [...prevData.nodes]
      updatedNodes[index].status = newStatus
      return { ...prevData, nodes: updatedNodes }
    })
  }

  const handleNodeDateChange = (index: number, newDate: Date) => {
    setData((prevData: any) => {
      const updatedNodes = [...prevData.nodes]
      updatedNodes[index].expiryDate = newDate
      return { ...prevData, nodes: updatedNodes }
    })
  }

  const handleNodeUpdate = async (node: any) => {
    try {
      const response = await fetch("/api/manage/user/node", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nodeId: node.id,
          status: node.status,
          expiryDate: node.expiryDate,
        }),
      })
      const result = await response.json()
      if (response.ok) {
        const url = `/api/manage/user/fetch?address=${address}`
        await fetchDataAndUpdate(
          url,
          "Node Successfully Updated",
          "Error Updating Node",
        )
      } else {
        throw new Error(result.error || "An unknown error occurred")
      }
    } catch (e) {
      toast({ title: "Update failed" })
      throw new Error()
    }
  }

  const togglePayments = (index: number) => {
    setExpandedPayments(expandedPayments === index ? null : index)
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="relative">
        {searchedData ? (
          <h1 className="text-2xl font-bold text-white">User Details</h1>
        ) : (
          <h1 className="text-2xl font-bold text-white">Support</h1>
        )}

        <Button
          onClick={() => signOut()}
          className="absolute right-3 top-3 z-10 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        >
          Sign out
        </Button>
      </div>
      {!searchedData ? (
        <AddressSearchBox
          address={address}
          setAddress={setAddress}
          handleSearch={handleSearch}
          loading={loading}
        />
      ) : (
        <>
          <div className="flex-1 mt-8 md:mt-12">
            <h1 className="text-[#F44336]">
              {address ? (
                <div className="flex flex-row gap-2 text-[18px]">
                  <h1>{address.slice(0, 18) || newAddress}</h1>
                  <button
                    title="Close"
                    onClick={() => {
                      setAddress("")
                      setNewAddress("")
                    }}
                    className="flex flex-row gap-2 text-white"
                  >
                    <X className="bg-[#777777] rounded-full w-5 h-5 p-1 items-center justify-center" />
                    Clear
                  </button>
                </div>
              ) : (
                <div className="flex flex-row gap-2">
                  <input
                    type="search"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="0xdee...."
                    className="px-4 py-2 border rounded-lg bg-transparent border-[#27272A] text-[#727272]"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Search"}
                  </button>
                </div>
              )}
            </h1>
          </div>
          <div className="flex flex-col md:flex-row gap-4 ">
            {data && (
              <div className="pt-6 flex flex-col md:flex-row gap-4  ">
                <div className="">
                  <SupportNodeCard
                    data={data}
                    handleAddBalance={handleAddBalance}
                  />
                </div>

                <div className=" flex flex-col gap-4  w-[65vw] ">
                  <div className="p-4 border rounded-lg mb-4 bg-[#0D0D0E] min-w-full">
                    {data?.nodes
                      ?.slice(0, nodesPage * itemsPerPage)
                      .map((node: any, index: number) => (
                        <div key={index} className="mb-4">
                          <div className="flex md:flex-row flex-col w-full justify-between">
                            <div>
                              <h1 className="text-white font-semibold text-xl mb-4">
                                Nodes
                              </h1>
                            </div>
                            <div className="flex justify-between gap-4 mb-2">
                              <button
                                onClick={() => togglePayments(index)}
                                className="px-2 py-1 bg-[#18181B] text-white rounded-lg flex flex-row gap-2"
                              >
                                <CircleDollarSign />{" "}
                                {expandedPayments === index
                                  ? "Hide Payments"
                                  : "Payments"}
                              </button>

                              <button
                                onClick={() => handleNodeUpdate(node)}
                                className="px-2 py-1 text-[#F44336] rounded-lg flex flex-row gap-2"
                              >
                                <RefreshCw /> Update
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row justify-between gap-4 mb-2">
                            <div>
                              <span>Wallet: {node.wallet}</span>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                              <span>Blockchain ID: {node.blockchainId}</span>
                              <div>
                                <span>Status: </span>
                                <select
                                  aria-label="Status"
                                  value={node.status}
                                  onChange={(e) =>
                                    handleNodeStatusChange(
                                      index,
                                      e.target.value,
                                    )
                                  }
                                  className=" border rounded-md bg-transparent text-white px-2 py-1 "
                                >
                                  {[
                                    "LIVE",
                                    "CREATED",
                                    "INSTALLING",
                                    "FAILED",
                                    "EXPIRED",
                                  ].map((status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <span>Expiry: </span>
                                <DatePicker
                                  selected={new Date(node.expiryDate)}
                                  onChange={(date: Date) =>
                                    handleNodeDateChange(index, date)
                                  }
                                  minDate={new Date(node.expiryDate)}
                                  className="border rounded-md bg-transparent text-white px-2 py-1"
                                />
                              </div>
                            </div>
                          </div>

                          {expandedPayments === index && (
                            <div className="ml-4 pt-2">
                              {node.payments?.map(
                                (payment: any, paymentIndex: number) => (
                                  <div
                                    key={paymentIndex}
                                    className="flex justify-between mb-2"
                                  >
                                    <span>
                                      {new Date(payment.date).toLocaleString()}
                                    </span>
                                    <span>{payment.credit} credits</span>
                                    <span>{payment.duration} days</span>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    {nodesPage * itemsPerPage < data?.nodes?.length && (
                      <button
                        onClick={handleMoreNodes}
                        className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-lg"
                      >
                        More
                      </button>
                    )}
                  </div>

                  <div className="p-4 border rounded-lg mb-4 bg-[#0D0D0E]">
                    <h3 className="text-lg font-semibold mb-4">Credits:</h3>
                    {data?.credits
                      ?.slice(0, creditsPage * itemsPerPage)
                      .map((credit: any, index: any) => (
                        <div key={index} className="flex justify-between p-2">
                          <span>{new Date(credit.date).toLocaleString()}</span>
                          {credit.tx ? (
                            <a
                              href={credit.tx}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600"
                            >
                              Transaction
                            </a>
                          ) : (
                            <span></span>
                          )}
                          <span>{credit.credits} credits</span>
                        </div>
                      ))}
                    {creditsPage * itemsPerPage < data?.credits?.length && (
                      <button
                        onClick={handleMoreCredits}
                        className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-lg"
                      >
                        More
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {showBalanceModal && (
        <AddCredit
          setShowBalanceModal={setShowBalanceModal}
          balanceInput={balanceInput}
          setBalanceInput={setBalanceInput}
          handleBalanceSubmit={handleBalanceSubmit}
        />
      )}
    </div>
  )
}
