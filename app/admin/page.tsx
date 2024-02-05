"use client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
type Node = {
  id: number
  name: string
  description: string
  fee: number
  duration: number
}
const Page = () => {
  const [nodes, setNodes] = useState<Node[]>([])
  const router = useRouter()
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/nodes")
      const data = await response.json()
      console.log(data)
      setNodes(data)
    }
    fetchData()
  }, [])
  if (!nodes) return <div>Loading...</div>

  return (
    <div>
      <h1>Admin Page</h1>
      <h1>Available Nodes</h1>
      <div>
        {nodes.map((node) => (
          <div key={node.name}>
            <h2>{node.name}</h2>
            <p>{node.description}</p>
            <p>Fee: {node.fee}</p>
            <p>Duration: {node.duration}</p>
            <button onClick={() => router.push(`/${node.id}/edit`)}>
              {" "}
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Page
