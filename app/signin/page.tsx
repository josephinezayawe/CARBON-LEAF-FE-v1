'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginData, LoginDataSchema } from "@/lib/dataSchemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AuthAPI } from "../api/authAPI"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react"

export default function SignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginData>({
    resolver: zodResolver(LoginDataSchema),
    defaultValues: {
      contact: '',
      password: '',
    }
  })

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true)
    
    try {
      const result = await AuthAPI.login(data)
      toast.success('Welcome back! Signed in successfully.')
      
      // Navigate based on role
      const route = result?.data.role === 'ADMIN' ? '/admin' : '/user'
      router.push(route)
    } catch (error) {
      toast.error('Unable to sign in. Please check your credentials.')
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-green-100/20 dark:from-slate-950 dark:via-emerald-950/20 dark:to-green-950/10 px-4 py-8">
      {/* Enhanced Form Card */}
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-br from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
              {/* Contact Field */}
              <FormField 
                control={form.control} 
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email or Phone
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email or phone number" 
                        {...field} 
                        className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} 
              />

              {/* Password Field */}
              <FormField 
                control={form.control} 
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password" 
                          autoComplete="current-password"
                          {...field} 
                          className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors pr-10"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} 
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-600/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Additional Links */}
          <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="text-center">
              <a 
                href="#" 
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium"
              >
                Forgot your password?
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            By continuing, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  )
}