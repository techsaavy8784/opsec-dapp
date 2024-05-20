"use client"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export default function Home() {
  const [address, setAddress] = useState("")
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showBalanceModal, setShowBalanceModal] = useState(false)
  const [balanceInput, setBalanceInput] = useState(0)
  const [creditsPage, setCreditsPage] = useState(1)
  const [nodesPage, setNodesPage] = useState(1)
  const [expandedPayments, setExpandedPayments] = useState<number | null>(null)
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
      const url = `/api/manage/user/fetch?address=${address}`
      await fetchDataAndUpdate(url, "User Found", "Error Searching User")
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <Button
        onClick={() => signOut()}
        className="absolute right-3 top-3 z-10 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
      >
        Sign out
      </Button>

      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="mb-4">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Ethereum Address"
          className="px-4 py-2 w-full border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {data && (
        <div>
          <div className="mb-4">
            <div className="flex justify-between">
              <label className="block mb-1 text-lg font-semibold">
                Balance:
              </label>
              <button
                className="px-4 py-2 ml-2 bg-green-500 text-white rounded-lg"
                onClick={handleAddBalance}
              >
                Add Credit
              </button>
            </div>
            <input
              type="number"
              value={data.balance}
              readOnly
              className="px-4 py-2 w-full border rounded-lg bg-gray-100 dark:bg-gray-700"
            />
          </div>
          {showBalanceModal && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
              <div className="dark:bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Add Balance</h2>
                <input
                  type="number"
                  value={balanceInput}
                  onChange={(e) => setBalanceInput(Number(e.target.value))}
                  className="px-4 py-2 w-full border rounded-lg mb-4 text-black dark:text-black"
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => setShowBalanceModal(false)}
                    className="px-4 py-2 bg-red-500 rounded-lg mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBalanceSubmit}
                    className="px-4 py-2 bg-blue-500 rounded-lg"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold">Nodes:</h3>
            {data?.nodes
              ?.slice(0, nodesPage * itemsPerPage)
              .map((node: any, index: number) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg mb-4 bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span>Wallet: {node.wallet}</span>
                    <span>Blockchain ID: {node.blockchainId}</span>
                    <div>
                      <span>Status:</span>
                      <select
                        value={node.status}
                        onChange={(e) =>
                          handleNodeStatusChange(index, e.target.value)
                        }
                        className="px-2 py-1 border rounded-lg bg-white dark:bg-gray-800"
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
                      <span>Expiry:</span>

                      <DatePicker
                        selected={new Date(node.expiryDate)}
                        onChange={(date: Date) =>
                          handleNodeDateChange(index, date)
                        }
                        minDate={new Date(node.expiryDate)}
                        className="px-2 py-1 border rounded-lg bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => togglePayments(index)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-2"
                    >
                      {expandedPayments === index ? "Payments" : "Payments"}
                    </button>

                    <button
                      onClick={() => handleNodeUpdate(node)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg"
                    >
                      Update
                    </button>
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

          <div>
            <h3 className="text-lg font-semibold">Credits:</h3>
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
      )}
    </div>
  )
}
