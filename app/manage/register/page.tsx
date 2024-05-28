"use client"
import React, { useState } from "react"
import axios from "axios"
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
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

const RegisterPage = () => {
  const formSchema = z.object({
    address: z.string().email(),
    password: z.string().min(6),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      address: "",
      password: "",
    },
  })
  const router = useRouter()
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data)
    try {
      const response = await axios.post("/api/register", data)
      console.log(response.data)
      if (response.status === 201) {
        alert("User registered successfully")
        form.reset()
        router.push("/manage/login")
      }
    } catch (error) {
      console.error(error)
      alert("Failed to register user")
    }
  }

  return (
    <div className="container text-white">
      <h2 className="text-3xl text-center flex justify-center items-center pt-10">
        Register
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 container"
        >
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email: </FormLabel>
                <FormControl>
                  <Input placeholder="admin@opsec.org" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password: </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default RegisterPage
