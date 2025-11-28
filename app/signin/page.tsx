'use client'

import { Card, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginData, LoginDataSchema, RegisterData, RegisterDataSchema } from "@/lib/dataSchemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { AuthAPI } from "../api/authAPI"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function SignIn() {
  const router = useRouter()
  const form = useForm<LoginData>({
    resolver: zodResolver(LoginDataSchema),
    defaultValues: {
      contact: '',
      password: '',
    }
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const data = form.getValues() as LoginData
      const result = await AuthAPI.login(data)
      toast.success('Logged In Successfully')
      if (result?.data.role === 'ADMIN') {
        router.push('/admin')
      } else if (result?.data.role === 'USER'){
        router.push('/user')
      }
    } catch (error) {
      toast.error('Failed To log you in')
      console.log(error);
    }
  }

  return (
    <Card>
      <CardTitle>Signup</CardTitle>
      <Form {...form}>
        <form onSubmit={((e) => onSubmit(e))} className="space-y-4">

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
