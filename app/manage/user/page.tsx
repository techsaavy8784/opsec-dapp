"use client"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const [address, setAddress] = useState("")
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [expandedNodes, setExpandedNodes] = useState(false)
  const [expandedCredits, setExpandedCredits] = useState(false)
  const [isEditing, setIsEditing] = useState<any>({ nodes: {}, credits: {} })
  const { toast } = useToast()

  const handleSearch = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/manage/user/fetch?address=${address}`)
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError("Failed to fetch data")
    }
    setLoading(false)
  }

  const handleInputChange = (
    e: any,
    field: any,
    index: any,
    section: any,
    subSection: any,
  ) => {
    const updatedData = { ...data }
    if (subSection) {
      updatedData[section][index][subSection][field] = e.target.value
    } else if (section) {
      updatedData[section][index][field] = e.target.value
    } else {
      updatedData[field] = e.target.value
    }
    setData(updatedData)
  }

  const handleEdit = (index: any, section: any) => {
    setIsEditing((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [index]: !prev[section][index],
      },
    }))
  }

  const handleSave = async (index: any, section: any) => {
    const payload: any = { id: data[section][index].id, type: section }

    if (section === "nodes") {
      payload.status = data[section][index].status
      payload.wallet = data[section][index].wallet
      payload.blockchainId = data[section][index].blockchainId
      payload.serverId = data[section][index].serverId
      payload.host = data.nodes[index].server.host
      payload.port = data.nodes[index].server.port
      payload.username = data.nodes[index].server.username
      payload.password = data.nodes[index].server.password
      payload.active = data.nodes[index].server.active
    } else if (section === "credits") {
      payload.tx = data[section][index].tx
      payload.credits = data[section][index].credits
      payload.date = data[section][index].date
    }

    try {
      const response = await fetch("/api/manage/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (response.ok) {
        toast({
          title: "Successfully Updated",
        })
      } else {
        throw new Error(result.error || "An unknown error occurred")
      }
    } catch (error: any) {
      console.error("Save failed:", error)
      toast({
        title: "Updation failed",
      })
    }
    handleEdit(index, section)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="mb-4">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Ethereum Address"
          className="px-4 py-2 w-full border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
        />
      </div>
      <div className="mb-4">
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {data && (
        <div>
          <h2 className="text-xl font-bold mb-2">Address Information</h2>
          <div className="mb-4">
            <label className="block mb-1">Balance:</label>
            <input
              type="number"
              value={data.balance}
              className="px-4 py-2 w-full border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <h3
            className="text-lg font-bold mb-2 cursor-pointer"
            onClick={() => setExpandedNodes(!expandedNodes)}
          >
            Nodes {expandedNodes ? "-" : "+"}
          </h3>
          {expandedNodes &&
            data?.nodes?.map((node: any, index: any) => (
              <div
                key={index}
                className="mb-4 border p-4 rounded-lg bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between">
                  <div className="mb-2 w-full">
                    <label className="block mb-1">Node ID:</label>
                    <input
                      type="text"
                      value={node.id}
                      onChange={(e) =>
                        handleInputChange(e, "id", index, "nodes", "")
                      }
                      readOnly
                      className="px-4 py-2 w-full border rounded-lg bg-gray-100 dark:bg-gray-700"
                    />
                  </div>
                  <button
                    className="px-4 py-1 ml-2 bg-green-500 text-white rounded-lg"
                    onClick={() => handleEdit(index, "nodes")}
                  >
                    {isEditing.nodes[index] ? "Cancel" : "Edit"}
                  </button>
                  {isEditing.nodes[index] && (
                    <button
                      className="px-4 py-1 ml-2 bg-blue-500 text-white rounded-lg"
                      onClick={() => handleSave(index, "nodes")}
                    >
                      Save
                    </button>
                  )}
                </div>
                <div className="mb-2">
                  <label className="block mb-1">Status:</label>
                  <select
                    value={node.status}
                    onChange={(e) =>
                      handleInputChange(e, "status", index, "nodes", "")
                    }
                    disabled={!isEditing.nodes[index]}
                    className={`px-4 py-2 w-full border rounded-lg ${
                      isEditing.nodes[index]
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {["LIVE", "CREATED", "INSTALLING", "FAILED", "EXPIRED"].map(
                      (status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                {["wallet", "createdAt", "blockchainId"].map((field) => (
                  <div className="mb-2" key={field}>
                    <label className="block mb-1 capitalize">
                      {field.replace(/([A-Z])/g, " $1")}:
                    </label>
                    <input
                      type="text"
                      value={node[field]}
                      onChange={(e) =>
                        handleInputChange(e, field, index, "nodes", "")
                      }
                      readOnly={!isEditing.nodes[index]}
                      className={`px-4 py-2 w-full border rounded-lg ${
                        isEditing.nodes[index]
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    />
                  </div>
                ))}
                {["host", "port", "username", "password", "active"].map(
                  (field) => (
                    <div className="mb-2" key={field}>
                      <label className="block mb-1 capitalize">
                        {`Server ${field}`}:
                      </label>
                      <input
                        type={field === "password" ? "password" : "text"}
                        value={node.server[field]}
                        onChange={(e) =>
                          handleInputChange(e, field, index, "nodes", "server")
                        }
                        readOnly={!isEditing.nodes[index]}
                        className={`px-4 py-2 w-full border rounded-lg ${
                          isEditing.nodes[index]
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      />
                    </div>
                  ),
                )}
              </div>
            ))}
          <h3
            className="text-lg font-bold mb-2 cursor-pointer"
            onClick={() => setExpandedCredits(!expandedCredits)}
          >
            Credits {expandedCredits ? "-" : "+"}
          </h3>
          {expandedCredits &&
            data?.credits?.map((credit: any, index: any) => (
              <div
                key={index}
                className="mb-4 border p-4 rounded-lg bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between">
                  <div className="mb-2 w-full">
                    <label className="block mb-1">Credit ID:</label>
                    <input
                      type="text"
                      value={credit.id}
                      onChange={(e) =>
                        handleInputChange(e, "id", index, "credits", "")
                      }
                      readOnly
                      className="px-4 py-2 w-full border rounded-lg bg-gray-100 dark:bg-gray-700"
                    />
                  </div>
                  <button
                    className="px-4 py-1 ml-2 bg-green-500 text-white rounded-lg"
                    onClick={() => handleEdit(index, "credits")}
                  >
                    {isEditing.credits[index] ? "Cancel" : "Edit"}
                  </button>
                  {isEditing.credits[index] && (
                    <button
                      className="px-4 py-1 ml-2 bg-blue-500 text-white rounded-lg"
                      onClick={() => handleSave(index, "credits")}
                    >
                      Save
                    </button>
                  )}
                </div>
                {["tx", "credits", "date"].map((field) => (
                  <div className="mb-2" key={field}>
                    <label className="block mb-1 capitalize">
                      {field.replace(/([A-Z])/g, " $1")}:
                    </label>
                    <input
                      type="text"
                      value={credit[field]}
                      onChange={(e) =>
                        handleInputChange(e, field, index, "credits", "")
                      }
                      readOnly={!isEditing.credits[index]}
                      className={`px-4 py-2 w-full border rounded-lg ${
                        isEditing.credits[index]
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    />
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
