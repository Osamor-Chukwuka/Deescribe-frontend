export default function Footer() {
    return (
        <div className="">
            <footer className="bg-gray-900 text-gray-400">
                <div className="px-4 sm:px-8 md:px-16 py-15">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-white text-lg font-bold mb-2">Deescribe</h3>
                            <p className="max-w-[90%]">The platform where great stories come to life.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-2">Product</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-white">Features</a></li>
                                <li><a href="#" className="hover:text-white">Pricing</a></li>
                                <li><a href="#" className="hover:text-white">Mobile App</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-2">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-white">About</a></li>
                                <li><a href="#" className="hover:text-white">Careers</a></li>
                                <li><a href="#" className="hover:text-white">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-2">Support</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-white">Help Center</a></li>
                                <li><a href="#" className="hover:text-white">Privacy</a></li>
                                <li><a href="#" className="hover:text-white">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
                        © 2025 Deescribe. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}