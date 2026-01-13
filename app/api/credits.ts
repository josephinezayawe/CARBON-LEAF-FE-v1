import api from "./api"

export const CreditsAPI = {

    getSystemCredits: async () => {
        try {
            const result = await api.get('/api/credits/systemOverview')
            console.log(result.data.data);
            
            return result.data.data

        } catch (error) {
            throw new Error(error as string)
        }
    }

}