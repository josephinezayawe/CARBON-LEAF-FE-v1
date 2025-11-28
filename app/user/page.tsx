"use client"
import { getCurrentUser } from "@/lib/auth"
import { Account } from "@/lib/dataSchemas"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function FrmerSide() {
    const [account, setAccount] = useState<Account>()
    useEffect(() => {
        async function userData() {
            const user = await getCurrentUser()
            if (!user?.id) {
                return toast.error('User Not Found')
            }  
            if (user?.role !== 'USER') {
                return toast.error('UnAuthenticated User')
            }
            setAccount(user)
        }
        userData()
    }, [])
            console.log(account);
    return (<>
        Hello
        {account && account.role}
    </>)
}