import { RegisterData } from "@/lib/dataSchemas"
import { z } from 'zod'
import api from "./api"

export const AuthAPI = {

    register: async (data: any) => {
        console.log('hello', data);

        try {
            const result = await api.post('register/', {
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
            const result = await api.post('login/', {
                data
            })
            return result.data
        } catch (error) {
            throw new Error(error as string)
        }

    }

}