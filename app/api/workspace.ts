import { CreateWorkspace } from "@/lib/workspaceSchemas"
import api from "./api"

export const Workspace = {
    
    create: async (uploadData: any) => {
        try {
            const result = await api.post('/api/uploadmultiple', uploadData)
            return {
                success: true,
                message: 'Done successfully',
                data: result.data
            }
        } catch (error) {
            return {
                success: false,
                message: error as string
            }
        }


    },
    get: async () => {
        try {
            const result = await api.get(`/api/user/workspace/`)            
            return {
                success: true,
                message: 'Done successfully',
                data: result.data as any
            }
            
        } catch (error) {
            return {
                success: false,
                message: error as string
            }
        }
    }
}