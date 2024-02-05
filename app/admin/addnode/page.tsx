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
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PulseLoader } from "react-spinners"
import { useToast } from "@/components/ui/use-toast"

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
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      fee: 0,
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true)
    const res = await fetch("/api/admin/node", {
      method: "POST",
      body: JSON.stringify(values),
    })
    if (!res.ok) {
      setSubmitting(false)
      toast({
        title: "Error",
        description: "Error adding Node!",
        variant: "destructive",
      })
      return
    }
    const data = await res.json()
    console.log(data)
    toast({
      title: "Success",
      description: "Node added Successfully!",
      variant: "success",
    })
    form.reset()
    setSubmitting(false)
  }

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
