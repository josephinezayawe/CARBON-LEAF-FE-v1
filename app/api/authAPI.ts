import { RegisterData } from "@/lib/dataSchemas"
import api from "./api"

type RegisterPayload = Omit<RegisterData, "confirmPassword">;

export const AuthAPI = {

    register: async (data: RegisterPayload) => {
        const result = await api.post('/api/register/', data)
        return result.data
    },
    login: async (data: { contact: string; password: string }) => {
        const result = await api.post('/api/login/', data)
        return result.data
    },
    loginVerify: async (data: { contact: string, otp: string }) => {
        const result = await api.post('/api/auth/login-verify', data)
        return result.data
    },
    verifyEmail: async (data: { contact: string, otp: string }) => {
        const result = await api.post('/api/auth/verify-email', data)
        return result.data
    },
    resendOtp: async (data: { contact: string }) => {
        const result = await api.post('/api/auth/resend-otp', data)
        return result.data
    },
    logout: async () => {
        const result = await api.post('/api/logout/')
        return result.data
    }
}