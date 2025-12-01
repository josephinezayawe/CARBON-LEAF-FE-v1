import { RegisterData } from "@/lib/dataSchemas"
import { z } from 'zod'
import api from "./api"

export const WalletAPI = {

    getWallet: async () => {
        try {
            const result = await api.get('wallet')
            return result.data
        } catch (error) {
            throw new Error(error as string)
        }
    }

}