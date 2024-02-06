"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PulseLoader } from "react-spinners"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
})
function LoginForm() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    if (values.password !== values.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      form.setError("password", {
        type: "manual",
        message: "Passwords do not match",
      })
      form.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      })
      return
    }
    setLoading(true)
    const res = await fetch("/api/admin/addadmin", {
      method: "POST",
      body: JSON.stringify(values),
    })
    if (!res.ok) {
      toast({
        title: "Error",
        description: "Error adding admin!",
        variant: "destructive",
      })
      return
    }
    const data = await res.json()
    console.log(data)
    toast({
      title: "Success",
      description: "Admin added successfully!",
      variant: "default",
    })
    setLoading(false)
    form.reset()
  }

  return (
    <div className="relative">
      <Dialog open={loading}>
        <DialogContent>
          <div className="w-full h-full flex justify-center">
            <PulseLoader color="black" />
          </div>
        </DialogContent>
      </Dialog>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="absolute left-[100px] flex flex-col gap-4 justify-center items-center"
        >
          <div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">email</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      placeholder="admin@opsec.org"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-white"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-white"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full my-6" type="submit">
              Add admin
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
export default LoginForm
