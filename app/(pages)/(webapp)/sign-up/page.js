'use client';
import { FcGoogle, FaXTwitter, ArrowLeft, Button, useEffect, useState, SignupApi, FaPencil, useUserStore, useRouter, Cookies } from "@/app/ui/imports";

export default function SignUpPage() {
    // GLOBAL STATES
    const setUser = useUserStore((state) => state.setUser);
    // LOCAL STATES
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter(); 

    // handle submit
    const handleSubumit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { response, jsonResponse, error } = await SignupApi(name, email, password)
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
                <h2 className="text-2xl font-bold text-gray-900 text-center">Create an account</h2>
                <p className="mt-2 text-sm text-gray-600 text-center">
                    Enter your information to create your Deescribe account
                </p>

                <form onSubmit={handleSubumit} className="mt-6 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
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

                    {error && (
                        <div className="flex justify-center">
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    )}

                    <div>
                        {!loading ?
                            <Button type={'submit'} className="w-full bg-primary hover:bg-primary-hover">Create account</Button>
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

                <p className="mt-6 text-center text-sm text-gray-500">
                    By creating an account, you agree to our{' '}
                    <a href="#" className="text-primary hover:text-primary-hover">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary hover:text-primary-hover">
                        Privacy Policy
                    </a>
                </p>

                <p className="mt-2 text-center text-sm text-gray-700">
                    Already have an account?{' '}
                    <a href="./login" className="text-primary hover:text-primary-hover font-medium">
                        Sign in
                    </a>
                </p>
            </div>
        </main>
    );
}
