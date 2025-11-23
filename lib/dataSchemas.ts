import {email, z} from 'zod'
import {parsePhoneNumberFromString} from 'libphonenumber-js'
import { Contact } from 'lucide-react'

const PhoneSchema = z.string().refine(
    (value) => {
        return parsePhoneNumberFromString(value)?.isValid()
    },
    {
        message: 'Invalid Contact'
    }
)

const EmailSchema = z.string().email('Invalid Contact')


export const RegisterDataSchema = z.object({
    firstName: z.string().min(1,"Name Can't be empty"),
    lastName: z.string().min(1,"Last Name can't be empty"),
    contact: z.union([PhoneSchema,EmailSchema]),
    password: z.string(),
    nid: z.string(),
    conservationSector: z.string().min(1,"Select Sector"),
    district: z.string().min(1,"Select District"),
    cell: z.string().min(1,"Select Cell"),
    village: z.string().min(1,"Select Village"),
    province: z.string().min(1,"Select Province"),
    sector: z.string().min(1,"Select Sector"),
    confirmPassword: z.string().optional
}).superRefine((data,ctx) =>{
    if(data.password !== data.confirmPassword){
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password don't match",
            path: ['confirmPassword']
        })
    }
})
export const LoginDataSchema = z.object({
    contact: z.union([PhoneSchema,EmailSchema]),
    password: z.string().min(1),
})
export type RegisterData = z.infer<typeof RegisterDataSchema>
export type LoginData = z.infer<typeof LoginDataSchema>