'use client'

import { Card, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterData, RegisterDataSchema } from "@/lib/dataSchemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import axios from "axios"
import { AuthAPI } from "../api/authAPI"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Rwanda hierarchy (simplified, expand as needed)
const rwandaAdministrativeDivisions = [
    {
        province: "Kigali City",
        districts: [
            {
                district: "Gasabo",
                sectors: [
                    {
                        sector: "Kacyiru",
                        cells: ["Kabeza", "Gatsata", "Kigobe", "Nyagahanga"]
                    },
                    {
                        sector: "Kimihurura",
                        cells: ["Biryogo", "Kacyiru", "Gisozi"]
                    }
                    // Add remaining sectors
                ]
            },
            {
                district: "Nyarugenge",
                sectors: [
                    {
                        sector: "Nyamirambo",
                        cells: ["Gikondo", "Nyamirambo", "Rwezamenyo"]
                    },
                    {
                        sector: "Kigali",
                        cells: ["Gitega", "Kigali", "Muhima"]
                    }
                ]
            },
            {
                district: "Kicukiro",
                sectors: [
                    {
                        sector: "Gahanga",
                        cells: ["Gahanga", "Niboye", "Kigarama"]
                    },
                    {
                        sector: "Kagarama",
                        cells: ["Kigarama", "Kagarama", "Nyarutarama"]
                    }
                ]
            }
        ]
    },
    {
        province: "Northern Province",
        districts: [
            {
                district: "Musanze",
                sectors: [
                    {
                        sector: "Musanze",
                        cells: ["Muhoza", "Buhunga", "Busogo"]
                    },
                    {
                        sector: "Kinigi",
                        cells: ["Kinigi", "Kundara", "Cyuve"]
                    }
                ]
            },
            {
                district: "Gicumbi",
                sectors: [
                    {
                        sector: "Byumba",
                        cells: ["Byumba", "Kareba", "Nemba"]
                    },
                    {
                        sector: "Bukure",
                        cells: ["Bukure", "Muzo", "Mugote"]
                    }
                ]
            }
        ]
    },
    {
        province: "Southern Province",
        districts: [
            {
                district: "Huye",
                sectors: [
                    { sector: "Ngoma", cells: ["Ngoma", "Muganza", "Gikundamvura"] },
                    { sector: "Huye", cells: ["Cyangugu", "Huye", "Ngoma"] }
                ]
            },
            {
                district: "Nyanza",
                sectors: [
                    { sector: "Busasamana", cells: ["Busasamana", "Busoro", "Kibirizi"] },
                    { sector: "Busogo", cells: ["Busogo", "Nyamabuye", "Cyamabuye"] }
                ]
            }
        ]
    },
    {
        province: "Eastern Province",
        districts: [
            {
                district: "Rwamagana",
                sectors: [
                    { sector: "Mwurire", cells: ["Mwurire", "Gishari", "Nyarurama"] },
                    { sector: "Nyakariro", cells: ["Nyakariro", "Gasharu", "Rurenge"] }
                ]
            }
        ]
    },
    {
        province: "Western Province",
        districts: [
            {
                district: "Rubavu",
                sectors: [
                    { sector: "Gisenyi", cells: ["Gisenyi", "Kamuha", "Busasamana"] },
                    { sector: "Nyundo", cells: ["Nyundo", "Mugongi", "Mabayi"] }
                ]
            }
        ]
    }
];

export default function Signup() {
    const conservationSectors = [
        "FARMER",
    ];

    const router = useRouter()

    const form = useForm<RegisterData>({
        resolver: zodResolver(RegisterDataSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            contact: '',
            password: '',
            nid: '',
            conservationSector: '',
            confirmPassword: '',
            province: '',
            district: '',
            sector: '',
            cell: '',
            village: ''
        }
    })
    const [selectedProvince, setSelectedProvince] = useState('')
    const [selectedDistrict, setSelectedDistrict] = useState('')
    const [selectedSector, setSelectedSector] = useState('')
    const [selectedCell, setSelectedCell] = useState('')

    const districts = rwandaAdministrativeDivisions.find(p => p.province === selectedProvince)?.districts || []
    const sectors = districts.find(d => d.district === selectedDistrict)?.sectors || []
    const cells = sectors.find(s => s.sector === selectedSector)?.cells || []
    const villages = cells // for simplicity, assume cell = village array (replace with real data if available)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = form.getValues() as RegisterData
        const { confirmPassword, ...newData } = data
        console.log("Form data:", data);
        try {
            const result = await AuthAPI.register(newData);
            toast.success('Registration successful!')
            if (result?.data.role === 'ADMIN') {
                router.push('/admin')
            } else if (result?.data.role === 'USER') {
                router.push('/user')
            }
        } catch (err) {
            toast.error('Registration failed!')
            console.error("Error:", err);
        }
    };


    return (
        <Card>
            <CardTitle>Signup</CardTitle>
            <Form {...form}>
                <form onSubmit={((e) => onSubmit(e))} className="space-y-4">

                    {/* First Name */}
                    <FormField control={form.control} name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter First Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    {/* Last Name */}
                    <FormField control={form.control} name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Last Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    {/* Contact */}
                    <FormField control={form.control} name="contact"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email or Phone</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Your Email or Phone" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    {/* Password */}
                    <FormField control={form.control} name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="*******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    {/* Confirm Password */}
                    <FormField control={form.control} name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="*******" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    {/* NID */}
                    <FormField control={form.control} name="nid"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>NID</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter NID" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    {/* Province */}
                    <FormField control={form.control} name="province"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Province</FormLabel>
                                <FormControl>
                                    <Select
                                        {...field}
                                        value={field.value || ""}
                                        onValueChange={(val) => {
                                            field.onChange(val)
                                            setSelectedProvince(val)
                                            setSelectedDistrict('')
                                            setSelectedSector('')
                                            setSelectedCell('')
                                            form.setValue("district", "")
                                            form.setValue("sector", "")
                                            form.setValue("cell", "")
                                            form.setValue("village", "")
                                        }}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Province" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Province</SelectLabel>
                                                {rwandaAdministrativeDivisions.map(p => (
                                                    <SelectItem key={p.province} value={p.province}>{p.province}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    {/* District */}
                    <FormField control={form.control} name="district"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>District</FormLabel>
                                <FormControl>
                                    <Select
                                        {...field}
                                        value={field.value || ""}
                                        onValueChange={(val) => {
                                            field.onChange(val)
                                            setSelectedDistrict(val)
                                            setSelectedSector('')
                                            setSelectedCell('')
                                            form.setValue("sector", "")
                                            form.setValue("cell", "")
                                            form.setValue("village", "")
                                        }}
                                        disabled={!selectedProvince}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select District" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>District</SelectLabel>
                                                {districts.map(d => (
                                                    <SelectItem key={d.district} value={d.district}>{d.district}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    {/* Sector */}
                    <FormField control={form.control} name="sector"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sector</FormLabel>
                                <FormControl>
                                    <Select
                                        {...field}
                                        value={field.value || ""}
                                        onValueChange={(val) => {
                                            field.onChange(val)
                                            setSelectedSector(val)
                                            setSelectedCell('')
                                            form.setValue("cell", "")
                                            form.setValue("village", "")
                                        }}
                                        disabled={!selectedDistrict}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Sector" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Sector</SelectLabel>
                                                {sectors.map(s => (
                                                    <SelectItem key={s.sector} value={s.sector}>{s.sector}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    {/* Cell */}
                    <FormField control={form.control} name="cell"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cell</FormLabel>
                                <FormControl>
                                    <Select
                                        {...field}
                                        value={field.value || ""}
                                        onValueChange={(val) => {
                                            field.onChange(val)
                                            setSelectedCell(val)
                                            form.setValue("village", "")
                                        }}
                                        disabled={!selectedSector}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Cell" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Cell</SelectLabel>
                                                {cells.map(c => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    {/* Village */}
                    <FormField control={form.control} name="village"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Village</FormLabel>
                                <FormControl>
                                    <Select
                                        {...field}
                                        value={field.value || ""}
                                        onValueChange={(val) => field.onChange(val)}
                                        disabled={!selectedCell}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Village" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Village</SelectLabel>
                                                {villages.map(v => (
                                                    <SelectItem key={v} value={v}>{v}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="conservationSector"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Conservation Sector</FormLabel>
                                <FormControl>
                                    <Select
                                        {...field}
                                        value={field.value || ""}
                                        onValueChange={(val) => field.onChange(val)}
                                    >
                                        <SelectTrigger className="w-[220px]">
                                            <SelectValue placeholder="Select Conservation Sector" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Available Sectors</SelectLabel>

                                                {conservationSectors.map((sector) => (
                                                    <SelectItem key={sector} value={sector}>
                                                        {sector}
                                                    </SelectItem>
                                                ))}

                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full mt-2">Sign Up</Button>

                </form>
            </Form>
        </Card>
    )
}
