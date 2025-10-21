"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/ui/components/general/card"
import { Button } from "@/app/ui/imports"
import { ResetPasswordApi } from "@/app/api/api"

export default function ResetPasswordPage() {
    const searchParams = useSearchParams()
    const email = searchParams.get("email")
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [resetError, setResetError] = useState(null)

    if (!email || !token) {
        return (
            <div className="flex flex-col h-screen justify-center items-center">
                <p className="">No email or token found</p>
            </div>
        )
    }

    const validatePassword = () => {
        const newErrors = {}

        if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validatePassword()) {
            return
        }
        setIsLoading(true)
        setResetError(null)

        try {
            const { response, jsonResponse, error } = await ResetPasswordApi(email, password, confirmPassword, token)

            if (error) {
                throw new Error(error)
            }

            if (response.ok && jsonResponse?.status) {
                setIsSubmitted(true)
            } else if (!response.ok || !jsonResponse?.status) {
                throw new Error(jsonResponse?.message || 'error reseting password')
            }
        } catch (error) {
            setResetError(error.message || "something went wrong")
            setTimeout(() => {
                setResetError(null)
            }, 2000);
            toast.error(error.message || "something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const getPasswordStrength = () => {
        if (password.length === 0) return { strength: 0, label: "", color: "" }
        if (password.length < 6) return { strength: 25, label: "Weak", color: "bg-red-500" }
        if (password.length < 10) return { strength: 50, label: "Fair", color: "bg-yellow-500" }
        if (password.length < 12) return { strength: 75, label: "Good", color: "bg-blue-500" }
        return { strength: 100, label: "Strong", color: "bg-green-500" }
    }

    const passwordStrength = getPasswordStrength()

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <Card className="w-full bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="space-y-1 text-center p-8 pb-6">
                            <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">Password Reset Successful!</CardTitle>
                            <CardDescription className="text-center text-base">
                                Your password has been successfully reset.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-2xl mb-6">
                                <p className="text-center text-sm text-green-900">You can now log in with your new password.</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center p-8 pt-0">
                            <Link href="/login" className="w-full">
                                <Button className="w-full bg-primary hover:bg-primary-hover rounded-xl h-12">Continue to Login</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-lg">

                <Card className="w-full bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-xl rounded-3xl overflow-hidden">
                    <CardHeader className="space-y-1 text-center p-8">
                        <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                            <Lock className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
                        <CardDescription className="text-center text-base">
                            Enter your new password below to reset your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-6">
                                {/* Email (Read-only) */}
                                <div className="grid gap-2">
                                    <label htmlFor="email" className="text-sm font-medium leading-none text-gray-700">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        readOnly
                                        className="flex bg-gray-200 h-12 w-full rounded-xl border border-gray-200 outline-0 px-4 py-2 text-base text-gray-600 cursor-not-allowed"
                                    />
                                </div>

                                {/* New Password */}
                                <div className="grid gap-2">
                                    <label htmlFor="password" className="text-sm font-medium leading-none text-gray-700">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`flex h-12 w-full rounded-xl border ${errors.password ? "border-red-300" : "border-gray-200"
                                                } bg-white pl-12 pr-12 py-2 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
                                            placeholder="Enter new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <div className="flex items-center text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.password}
                                        </div>
                                    )}

                                    {/* Password Strength Indicator */}
                                    {password.length > 0 && (
                                        <div className="space-y-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                                    style={{ width: `${passwordStrength.strength}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Password strength: <span className="font-medium">{passwordStrength.label}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="grid gap-2">
                                    <label htmlFor="confirmPassword" className="text-sm font-medium leading-none text-gray-700">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`flex h-12 w-full rounded-xl border ${errors.confirmPassword ? "border-red-300" : "border-gray-200"
                                                } bg-white pl-12 pr-12 py-2 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
                                            placeholder="Confirm new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <div className="flex items-center text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {errors.confirmPassword}
                                        </div>
                                    )}
                                </div>

                                {/* Password Requirements */}
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                                    <p className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</p>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li className="flex items-center">
                                            <span className={`mr-2 ${password.length >= 8 ? "text-green-600" : "text-blue-600"}`}>
                                                {password.length >= 8 ? "✓" : "•"}
                                            </span>
                                            At least 8 characters
                                        </li>
                                        <li className="flex items-center">
                                            <span className={`mr-2 ${/[A-Z]/.test(password) ? "text-green-600" : "text-blue-600"}`}>
                                                {/[A-Z]/.test(password) ? "✓" : "•"}
                                            </span>
                                            One uppercase letter
                                        </li>
                                        <li className="flex items-center">
                                            <span className={`mr-2 ${/[0-9]/.test(password) ? "text-green-600" : "text-blue-600"}`}>
                                                {/[0-9]/.test(password) ? "✓" : "•"}
                                            </span>
                                            One number
                                        </li>
                                    </ul>
                                </div>

                                <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary-hover rounded-xl text-base" disabled={isLoading}>
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Resetting Password...
                                        </span>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center p-8 pt-0">
                        <div className="text-center text-sm text-gray-600">
                            Remember your password?{" "}
                            <Link href="/login" className="text-teal-600 hover:underline font-medium">
                                Back to login
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
