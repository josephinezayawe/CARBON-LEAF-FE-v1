import { RegisterData } from "@/lib/dataSchemas"
import { z } from 'zod'
import api from "./api"

export const AuthAPI = {

    register: async (data: any) => {
        try {
            const result = await api.post('/api/register/', {
                data
            })
            return result.data
        } catch (error) {
            throw new Error(error as string)

            // console.log(error)

        }

    },
    login: async (data: any) => {
        try {
            const result = await api.post('/api/login/', {
                data
            })
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