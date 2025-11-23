"use server"
import { success, z } from 'zod'
import { LoginDataSchema, RegisterDataSchema } from "./dataSchemas";
import { AuthAPI } from '@/app/api/authAPI';
export async function Register(data: z.infer<typeof RegisterDataSchema>) {
    const result = await RegisterDataSchema.safeParse(data)

    if (result) {
        try {
            const register = await AuthAPI.register(data)
            return register
        } catch (error) {
            throw new Error('Something Failed')
        }
    }
    // if (!result.success) {
    //     const register = await AuthAPI.register(data)
    //     if (!register) {
    //         throw new Error('Something went wrong')
    //     }
    //     return {
    //         success: true,
    //         message: 'Working'
    //     }
    // }
    // return {
    //     success: true,
    //     message: 'Successfully'
    // }
}
export async function Login(data: z.infer<typeof LoginDataSchema>) {
    

    try {
        const login =  await AuthAPI.Login
    } catch (error) {
        
    }


}