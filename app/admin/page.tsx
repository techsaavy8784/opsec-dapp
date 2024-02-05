"use client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
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
      setNodes(data.data)
    }
    fetchData()
  }, [])
  console.log(nodes)
  if (!nodes || !Array.isArray(nodes)) return <div>Loading...</div>

  return (
    <div>
      <div className="w-full h-full flex justify-between items-center">
        <Label className="text-white">Nodes</Label>
        <Button onClick={() => router.push("/admin/addnode")}>Add Node</Button>
      </div>
      <Table>
        <TableHeader>
          <TableHead>Name</TableHead>
          <TableHead>Fee</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Edit</TableHead>
        </TableHeader>
        <TableBody>
          {nodes.map((node) => (
            <TableRow key={node.id}>
              <TableCell className="text-white">{node.name}</TableCell>
              <TableCell className="text-white">{node.fee}</TableCell>
              <TableCell className="text-white">{node.description}</TableCell>
              <TableCell>
                <Button onClick={() => router.push(`/admin/${node.id}/edit`)}>
                  {" "}
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="">
        <Button onClick={() => signOut()}>Sign Out</Button>
      </div>
    </div>
  )
}
export default Page
