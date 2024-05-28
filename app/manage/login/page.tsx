"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { PulseLoader } from "react-spinners"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

function LoginForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true)
    const result = await signIn("admin", {
      redirect: false,
      email: values.email,
      password: values.password,
    })

    if (!result?.error) {
      alert("Logged in!")
      router.push("/manage/user")
      form.reset()
    } else {
      // Handle error...
      toast({
        title: "Error",
        description: "Error logging in!",
        variant: "destructive",
      })
      form.setError("email", {
        type: "manual",
        message: "Invalid email or password",
      })
    }
    setLoading(false)
  }

  return (
    <div className="relative z-10  backdrop-blur-sm ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="absolute inset-x-0 top-[100px] w-full max-w-lg mx-auto p-8 bg-[#27272A] rounded-lg shadow-md flex flex-col gap-6"
        >
          <h1 className="text-white font-bold text-3xl flex justify-center items-center">
            Admin Login
          </h1>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="bg-transparent text-white border border-gray-300 rounded-md p-2"
                      placeholder="admin@opsec.org"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-transparent text-white border border-gray-300 rounded-md p-2"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />
          </div>
          {loading ? (
            <Button
              className="w-full py-3 mt-6 flex justify-center items-center  text-white rounded-md shadow-sm opacity-50 cursor-not-allowed"
              type="submit"
              disabled
            >
              <PulseLoader color="white" />
            </Button>
          ) : (
            <Button className="w-full py-3 mt-6 hover:bg-[#F44336] text-white rounded-md shadow-sm">
              Login
            </Button>
          )}
        </form>
      </Form>
    </div>
  )
}
export default LoginForm
