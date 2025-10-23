import { Star } from "@/app/ui/imports";

export default function Testimonials() {
    const testimonies = [
        {
            quote: "Deescribe has transformed how I share my ideas. The audience engagement is incredible.",
            name: "Sarah Chen",
            role: "Tech Writer",
        },
        {
            quote: "I've built my entire personal brand through Deescribe. The platform just works.",
            name: "Marcus Johnson",
            role: "Entrepreneur",
        },
        {
            quote: "The writing experience is unmatched. Clean, simple, and lets me focus on storytelling.",
            name: "Elena Rodriguez",
            role: "Journalist",
        },
    ];
    return (
        <section className="bg-gray-50 py-16 my-[10%]">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-0">
                <h2 className="text-3xl  lg:text-4xl font-extrabold text-gray-900 text-center">
                    Loved by writers worldwide
                </h2>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 w-full gap-6">
                    {testimonies.map((t, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-lg shadow">
                            <div className="flex space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-400" />
                                ))}
                            </div>
                            <p className="mt-4 text-gray-700 text-sm">"{t.quote}"</p>
                            <div className="mt-6 flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                                    <p className="text-sm text-gray-600">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}