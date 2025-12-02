"use client"
import { useAuth } from "@/context/authContext"
import { getCurrentUser } from "@/lib/auth"
import { Account } from "@/lib/dataSchemas"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function FrmerSide() {
    const {user } = useAuth();
    return (<>
        Hello
        {user && user.role}
    </>)
}