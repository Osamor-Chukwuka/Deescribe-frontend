'use client';
import { useUserStore } from "@/app/store/user-store";
import { FcGoogle, FaXTwitter, ArrowLeft, Button, useState, LoginApi, useRouter, FaPencil, Cookies, useEffect } from "@/app/ui/imports";

export default function LoginPage() {
    // GLOBAL STATES
    const setUser = useUserStore((state) => state.setUser)
    const clearUser = useUserStore((state) => state.clearUser)

    // LOCAL STATES
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter();


    // handle submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { response, jsonResponse, error } = await LoginApi(email, password)
            console.log(jsonResponse)

            if (error) {
                setError(error)
                setTimeout(() => {
                    setError(null)
                }, 3000);
                setLoading(false)
                return
            }

            if (response.ok) {
                setUser(jsonResponse)
                Cookies.set('token', jsonResponse.token, { expires: 1, sameSite: 'Strict' }); // Store user data in cookies
                console.log(Cookies.get('token'))
                router.push('/')
            } else {
                setError(jsonResponse.message)
                setTimeout(() => {
                    setError(null)
                }, 3000);
                setLoading(false)
                return
            }
        } catch (error) {
            setError(error.message)
            setTimeout(() => {
                setError(null)
            }, 3000);
            setLoading(false)
            return
        }
    }

    useEffect(() => {
        clearUser() // Clear user data on component mount
    }, [])

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Back to home link */}
            <div className="w-full max-w-md flex justify-center">
                <a href="/" className="flex items-center text-gray-600 hover:text-gray-800 mb-6">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to home
                </a>
            </div>

            {/* Form container */}
            <div className="w-full lg:max-w-[40%] bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center">Welcome Back</h2>
                <p className="mt-2 text-sm text-gray-600 text-center">
                    Enter your credentials to access your account
                </p>

                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            name="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="flex items-center justify-end -mt-2">
                        <a href="./forgot-password" className="text-xs text-primary hover:text-primary-hover">
                            Forgot password?
                        </a>
                    </div>

                    {error && (
                        <div className="flex justify-center">
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    )}

                    <div>
                        {!loading ?
                            <Button type={'submit'} className="w-full bg-primary hover:bg-primary-hover">Log in</Button>
                            :
                            <Button disabled={true} className="w-full bg-primary hover:bg-primary-hover disabled:cursor-not-allowed"><FaPencil />...</Button>
                        }
                    </div>
                </form>

                {/* OR divider */}
                <div className="mt-6 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR CONTINUE WITH</span>
                    </div>
                </div>

                {/* Social login buttons */}
                <div className="mt-6 grid grid-cols-1 gap-3">
                    <Button variant="outline" className="flex items-center justify-center">
                        <FcGoogle className="w-5 h-5 mr-2" />
                        Google
                    </Button>

                    <Button variant="outline" className="flex items-center justify-center">
                        <FaXTwitter className="w-5 h-5 mr-2" />
                        Twitter
                    </Button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-700">
                    Don't have an account?{' '}
                    <a href="./sign-up" className="text-primary-dark hover:text-primary-hover font-medium">
                        Sign up
                    </a>
                </p>
            </div>
        </main>
    );
}
