'use client';

import { Button,  Menu, X, React, useState, useRouter} from '@/app/ui/imports';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const router = useRouter()

    const links = [
        { href: '#', label: 'About' },
        { href: '#', label: 'Pricing' },
        { href: '#', label: 'Features' },
        { href: '#', label: 'Sign In' },
    ];

    return (
        <nav className="w-full border-b bg-white ">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 lg:px-0 py-4">
                <h1 className="text-2xl font-bold text-black">{process.env.NEXT_PUBLIC_APP_NAME}</h1>

                {/* Desktop links */}
                <div className="hidden md:flex gap-8 text-gray-700">
                    {links.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="hover:text-black"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Action button */}
                <div className="hidden md:block">
                    <Button onclick={()=>router.push('/login')}>Get Started</Button>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 text-gray-700 hover:text-black"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile menu panel */}
            {open && (
                <div className="md:hidden bg-white px-4 pb-4">
                    <div className="flex flex-col space-y-4">
                        {links.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="block text-gray-700 hover:text-black"
                            >
                                {link.label}
                            </a>
                        ))}
                        <Button onclick={()=>router.push('/login')} className="w-full">Get Started</Button>
                    </div>
                </div>
            )}
        </nav>
    );
}
