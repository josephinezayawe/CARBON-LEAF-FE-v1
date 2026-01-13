import { RegisterData } from "@/lib/dataSchemas"
import { z } from 'zod'
import api from "./api"

export const UsersAPI = {

    getAllUsers: async () => {
        try {
            const result = await api.get('/api/allUsers')
            return result.data.data
        } catch (error) {
            throw new Error(error as string)
        }
    }

}