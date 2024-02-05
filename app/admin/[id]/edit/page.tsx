"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PulseLoader } from "react-spinners"
import { useToast } from "@/components/ui/use-toast"
type Node = {
  id: number
  name: string
  description: string
  fee: number
  duration: number
}
const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  fee: z.number().min(0, {
    message: "fee must be at least 0.",
  }),
  description: z.string().min(2, {
    message: "description must be at least 2 characters.",
  }),
})
function EditForm() {
  const [node, setNode] = useState<Node>()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const response = await fetch("/api/nodes")
      const data = await response.json()
      console.log(data)
      const editNode = data.data.find((node: Node) => node.id === Number(id))
      form.setValue("name", editNode.name)
      form.setValue("fee", editNode.fee)
      form.setValue("description", editNode.description)
      setNode(editNode)
      setLoading(false)
    }
    fetchData()
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: node?.name || "",
      fee: node?.fee || 0,
      description: node?.description || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    if (
      values.name === node?.name &&
      values.fee === node?.fee &&
      values.description === node?.description
    )
      return
    setSubmitting(true)
    const res = await fetch("/api/admin/node", {
      method: "POST",
      body: JSON.stringify(values),
    })
    if (!res.ok) {
      setSubmitting(false)
      toast({
        title: "Error",
        description: "Error updating Node!",
        variant: "destructive",
      })
      return
    }
    const data = await res.json()
    toast({
      title: "Success",
      description: "Node updated Successfully!",
      variant: "default",
    })
    console.log(data)
    setSubmitting(false)
  }
  if (loading)
    return (
      <div className="w-full h-full flex justify-center">
        <PulseLoader color="white" />
      </div>
    )
  return (
    <Form {...form}>
      <Dialog open={submitting}>
        <DialogContent>
          <div className="w-full h-full flex justify-center">
            <PulseLoader color="black" />
          </div>
        </DialogContent>
      </Dialog>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Username</FormLabel>
              <FormControl>
                <Input className="bg-white" placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription className="text-white">
                this is the name of the Node
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Fee</FormLabel>
              <FormControl>
                <Input
                  className="bg-white"
                  type="number"
                  placeholder="Fee"
                  {...field}
                  onChange={(event) => {
                    field.onChange(parseFloat(event.target.value))
                  }}
                />
              </FormControl>
              <FormDescription className="text-white">
                This is the fee to run the Node per month
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Description</FormLabel>
              <FormControl>
                <Input
                  className="bg-white"
                  placeholder="Description"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-white">
                Description oif Node
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
export default EditForm
