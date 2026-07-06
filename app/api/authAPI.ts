import { RegisterData } from "@/lib/dataSchemas"
import { z } from 'zod'
import api from "./api"

export const AuthAPI = {

    register: async (data: any) => {
        try {
            console.log(data);
            
            const result = await api.post('/api/register/', data)
            return result.data
        } catch (error) {
            throw new Error(error as string)
        }
    },
    login: async (data: any) => {
        try {            
            const result = await api.post('/api/login/', data)
            return result.data
        } catch (error) {
            throw new Error(error as string)
        }
    },
    loginVerify: async (data: { contact: string, otp: string }) => {
        try {            
            const result = await api.post('/api/auth/login-verify', data)
            return result.data
        } catch (error) {
            throw new Error(error as string)
        }
    },
    verifyEmail: async (data: { contact: string, otp: string }) => {
        try {
            const result = await api.post('/api/auth/verify-email', data)
            return result.data
        } catch (error) {
            throw new Error(error as string)
        }
    },
    resendOtp: async (data: { contact: string }) => {
        try {
            const result = await api.post('/api/auth/resend-otp', data)
            return result.data
        } catch (error) {
            throw new Error(error as string)
        }
    },
    logout: async () => {
        try {
            const result = await api.post('/api/logout/')
            return result.data
        }
        catch (error) {
            throw new Error(error as string)
        }
    }
}