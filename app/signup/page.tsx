'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterData, RegisterDataSchema } from "@/lib/dataSchemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { AuthAPI } from "../api/authAPI"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, UserPlus, MapPin, ArrowRight, ArrowLeft, Check } from "lucide-react"

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

type FormStep = 1 | 2 | 3;

export default function Signup() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [currentStep, setCurrentStep] = useState<FormStep>(1)

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
    const villages = cells

    const steps = [
        { number: 1, title: "Personal Info", completed: currentStep > 1 },
        { number: 2, title: "Location", completed: currentStep > 2 },
        { number: 3, title: "Security", completed: currentStep > 3 }
    ]

    const onSubmit = async (data: RegisterData) => {
        setIsLoading(true)
        
        try {
            const { confirmPassword, ...newData } = data
            const result = await AuthAPI.register(newData)
            toast.success('Account created successfully! Welcome!')
            
            if (result?.data.role === 'ADMIN') {
                router.push('/admin')
            } else if (result?.data.role === 'USER') {
                router.push('/user')
            }
        } catch (error) {
            toast.error('Registration failed. Please try again.')
            console.error("Registration error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const nextStep = async () => {
        // Validate current step before proceeding
        const fields = getStepFields(currentStep)
        const isValid = await form.trigger(fields)
        
        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, 3) as FormStep)
        }
    }

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1) as FormStep)
    }

    const getStepFields = (step: FormStep): (keyof RegisterData)[] => {
        switch (step) {
            case 1:
                return ['firstName', 'lastName', 'contact', 'nid']
            case 2:
                return ['province', 'district', 'sector', 'cell', 'village']
            case 3:
                return ['password', 'confirmPassword']
            default:
                return []
        }
    }

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                        <div className={`
                            flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                            ${step.completed 
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : step.number === currentStep
                                ? 'border-emerald-500 bg-white text-emerald-500'
                                : 'border-slate-300 text-slate-400'
                            }
                        `}>
                            {step.completed ? (
                                <Check className="w-5 h-5" />
                            ) : (
                                <span className="text-sm font-semibold">{step.number}</span>
                            )}
                        </div>
                        
                        {/* Step Title */}
                        <span className={`
                            ml-3 text-sm font-medium hidden sm:block
                            ${step.number === currentStep ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500'}
                        `}>
                            {step.title}
                        </span>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className={`
                                w-12 h-0.5 mx-4 transition-colors duration-200
                                ${step.completed ? 'bg-emerald-500' : 'bg-slate-300'}
                            `} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-green-100/20 dark:from-slate-950 dark:via-emerald-950/20 dark:to-green-950/10 px-4 py-8">
            <div className="w-full max-w-2xl">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
                        <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-br from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                        Create Your Account
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Step {currentStep} of {steps.length}
                    </p>
                </div>

                {/* Progress Steps */}
                {renderStepIndicator()}

                {/* Form Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/20 p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
                            
                            {/* Step 1: Personal Information */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="text-center mb-6">
                                        <UserPlus className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                            Personal Information
                                        </h2>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Tell us about yourself
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        First Name *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="Enter your first name" 
                                                            {...field} 
                                                            className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )} 
                                        />

                                        <FormField control={form.control} name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Last Name *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="Enter your last name" 
                                                            {...field} 
                                                            className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )} 
                                        />

                                        <FormField control={form.control} name="contact"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Email or Phone *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="Enter your email or phone" 
                                                            {...field} 
                                                            className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )} 
                                        />

                                        <FormField control={form.control} name="nid"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        National ID *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="Enter your NID number" 
                                                            {...field} 
                                                            className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )} 
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Location Information */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="text-center mb-6">
                                        <MapPin className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                            Location Information
                                        </h2>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Where are you located?
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="province"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Province *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select
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
                                                            <SelectTrigger className="w-full h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors">
                                                                <SelectValue placeholder="Select Province" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Province</SelectLabel>
                                                                    {rwandaAdministrativeDivisions.map(p => (
                                                                        <SelectItem key={p.province} value={p.province}>
                                                                            {p.province}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )} 
                                        />

                                        <FormField control={form.control} name="district"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        District *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select
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
                                                            <SelectTrigger className="w-full h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors">
                                                                <SelectValue placeholder="Select District" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>District</SelectLabel>
                                                                    {districts.map(d => (
                                                                        <SelectItem key={d.district} value={d.district}>
                                                                            {d.district}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )} 
                                        />

                                        <FormField control={form.control} name="sector"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Sector *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select
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
                                                            <SelectTrigger className="w-full h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors">
                                                                <SelectValue placeholder="Select Sector" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Sector</SelectLabel>
                                                                    {sectors.map(s => (
                                                                        <SelectItem key={s.sector} value={s.sector}>
                                                                            {s.sector}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )} 
                                        />

                                        <FormField control={form.control} name="cell"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Cell *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            value={field.value || ""}
                                                            onValueChange={(val) => {
                                                                field.onChange(val)
                                                                setSelectedCell(val)
                                                                form.setValue("village", "")
                                                            }}
                                                            disabled={!selectedSector}
                                                        >
                                                            <SelectTrigger className="w-full h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors">
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
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )} 
                                        />

                                        <FormField control={form.control} name="village"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Village *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            value={field.value || ""}
                                                            onValueChange={(val) => field.onChange(val)}
                                                            disabled={!selectedCell}
                                                        >
                                                            <SelectTrigger className="w-full h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors">
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
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )} 
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Security Information */}
                            {currentStep === 3 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="text-center mb-6">
                                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <span className="w-4 h-4 bg-emerald-500 rounded-full"></span>
                                        </div>
                                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                            Security Settings
                                        </h2>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Create a secure password
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <FormField control={form.control} name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Password *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input 
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder="Create a strong password" 
                                                                autoComplete="new-password"
                                                                {...field} 
                                                                className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors pr-10"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                                            >
                                                                {showPassword ? (
                                                                    <EyeOff className="w-4 h-4" />
                                                                ) : (
                                                                    <Eye className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )} 
                                        />

                                        <FormField control={form.control} name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Confirm Password *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input 
                                                                type={showConfirmPassword ? "text" : "password"}
                                                                placeholder="Confirm your password" 
                                                                autoComplete="new-password"
                                                                {...field} 
                                                                className="h-11 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors pr-10"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                                            >
                                                                {showConfirmPassword ? (
                                                                    <EyeOff className="w-4 h-4" />
                                                                ) : (
                                                                    <Eye className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )} 
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className="flex items-center gap-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Previous
                                </Button>

                                {currentStep < 3 ? (
                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-600/25"
                                    >
                                        Next
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                ) : (
                                    <Button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-600/25 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-4 h-4" />
                                                Create Account
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
                        <div className="text-center">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Already have an account?{' '}
                                <a 
                                    href="/signin" 
                                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium"
                                >
                                    Sign in
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}