"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
// import { Button } from "@/app/ui/components/general/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/ui/components/general/card"
import { Button } from "@/app/ui/imports"
import { ForgotPasswordApi } from "@/app/api/api"
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const { response, jsonResponse, error } = await ForgotPasswordApi(email)

            if (error) {
                throw new Error(error)
            }

            if (response.ok && jsonResponse?.status) {
                setIsSubmitted(true)
            } else if (!response.ok || !jsonResponse?.status) {
                throw new Error(jsonResponse?.message || 'error sending reset password email')
            }
        } catch (error) {
            setError(error.message || "something went wrong")
            setTimeout(() => {
                setError(null)
            }, 2000);
            toast.error(error.message || "something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-6">
                        <Link
                            href="/login"
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to login
                        </Link>
                    </div>

                    <Card className="w-full bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="space-y-1 text-center p-8 pb-6">
                            <div className="mx-auto mb-4 w-16 h-16 bg-primary-hover rounded-full flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
                            <CardDescription className="text-center text-base">We've sent a password reset link to</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl mb-6">
                                <p className="text-center font-medium text-teal-900">{email}</p>
                            </div>
                            <div className="space-y-4 text-sm text-gray-600">
                                <p className="text-center">Click the link in the email to reset your password.</p>
                                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                                    <p className="text-sm text-blue-900">
                                        <strong>Didn't receive the email?</strong>
                                        <br />
                                        Check your spam folder or{" "}
                                        <button onClick={() => setIsSubmitted(false)} className="text-teal-600 hover:underline font-medium">
                                            try again
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center p-8 pt-0">
                            <Link href="/login" className="w-full">
                                <Button className="w-full bg-primary hover:bg-primary-hover rounded-xl">Return to Login</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">

                <Card className="w-full bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-xl rounded-3xl overflow-hidden">
                    <CardHeader className="space-y-1 text-center p-8">
                        <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                            <Mail className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
                        <CardDescription className="text-center text-base">
                            No worries! Enter your email and we'll send you reset instructions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <label htmlFor="email" className="text-sm font-medium leading-none text-gray-700">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="flex h-12 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>
                                {error && (
                                    <div className="text-xs text-center text-red-400">
                                        <p>{error}</p>
                                    </div>
                                )}
                                <Button type="submit" className="w-full bg-primary hover:bg-primary-hover h-12 rounded-xl text-base" disabled={isLoading}>
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
                                            Sending...
                                        </span>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center p-8 pt-0">
                        <div className="text-center text-sm">
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
