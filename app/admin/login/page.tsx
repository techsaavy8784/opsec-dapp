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
    const result = await signIn("credentials", {
      redirect: true,
      email: values.email,
      password: values.password,
    })

    if (!result?.error) {
      router.push("/admin")
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
    <div className="relative">
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
            {loading ? (
              <Button
                className="w-full my-6 flex justify-center"
                type="submit"
                disabled
              >
                <PulseLoader color="black" />
              </Button>
            ) : (
              <Button className="w-full my-6" type="submit">
                Login
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
export default LoginForm
