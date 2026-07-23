import { RegisterData } from "@/lib/dataSchemas"
import { z } from 'zod'
import api from "./api"
import { AxiosError } from "axios"

function extractErrorMessage(error: unknown): string {
    if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as Record<string, unknown>
        if (Array.isArray(data.errors) && data.errors.length > 0) {
            return (data.errors as Array<{ message: string }>)
                .map((e) => e.message)
                .join("; ")
        }
        if (typeof data.error === "string") return data.error
        if (typeof data.message === "string") return data.message
    }
    if (error instanceof Error) return error.message
    return "An unexpected error occurred"
}

export const AuthAPI = {

    register: async (data: any) => {
        try {
            console.log(data);
            
            const result = await api.post('/api/register/', data)
            return result.data
        } catch (error) {
            throw new Error(extractErrorMessage(error))
        }
    },
    login: async (data: any) => {
        try {            
            const result = await api.post('/api/login/', data)
            return result.data
        } catch (error) {
            throw new Error(extractErrorMessage(error))
        }
    },
    loginVerify: async (data: { contact: string, otp: string }) => {
        try {            
            const result = await api.post('/api/auth/login-verify', data)
            return result.data
        } catch (error) {
            throw new Error(extractErrorMessage(error))
        }
    },
    verifyEmail: async (data: { contact: string, otp: string }) => {
        try {
            const result = await api.post('/api/auth/verify-email', data)
            return result.data
        } catch (error) {
            throw new Error(extractErrorMessage(error))
        }
    },
    resendOtp: async (data: { contact: string }) => {
        try {
            const result = await api.post('/api/auth/resend-otp', data)
            return result.data
        } catch (error) {
            throw new Error(extractErrorMessage(error))
        }
    },
    logout: async () => {
        try {
            const result = await api.post('/api/logout/')
            return result.data
        }
        catch (error) {
            throw new Error(extractErrorMessage(error))
        }
    }
}