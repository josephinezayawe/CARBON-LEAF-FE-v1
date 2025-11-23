'use client'

import { Card, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginData, LoginDataSchema, RegisterData, RegisterDataSchema } from "@/lib/dataSchemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Login, Register } from "@/lib/actions"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { AuthAPI } from "../api/authAPI"

export default function SignIn() {
  const form = useForm<LoginData>({
    resolver: zodResolver(LoginDataSchema),
    defaultValues: {
      contact: '',
      password: '',
    }
  })
 
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data =form.getValues() as LoginData
    const result = await AuthAPI.login(data)
    console.log(result)
    console.log("hello world");
  }

  return (
    <Card>
      <CardTitle>Signup</CardTitle>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((e) => onSubmit(e))} className="space-y-4">

          {/* Contact */}
          <FormField control={form.control} name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Email or Phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

          {/* Password */}
          <FormField control={form.control} name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="*******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <Button type="submit" className="w-full mt-2">Sign In</Button>
        </form>
      </Form>
    </Card>
  )
}
