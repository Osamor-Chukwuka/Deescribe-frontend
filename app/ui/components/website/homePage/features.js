import { BookOpen, TrendingUp, Users } from "@/app/ui/imports";

export default function FeaturesSection() {
    return (
        <section className="">
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    Everything you need to tell your story
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                    Powerful tools and features designed to help you write, publish, and grow your audience.
                </p>
            </div>
            <div className="mt-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <BookOpen className="w-8 h-8 text-green-600 mx-auto" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 text-center">Beautiful Editor</h3>
                    <p className="mt-2 text-gray-600 text-sm text-center">
                        Write with our distraction-free editor that focuses on your words, not formatting.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <Users className="w-8 h-12 text-green-600 mx-auto" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 text-center">Built-in Audience</h3>
                    <p className="mt-2 text-gray-600 text-sm text-center">
                        Reach millions of readers who are actively looking for quality content like yours.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 text-center">Earn Money</h3>
                    <p className="mt-2 text-gray-600 text-sm text-center">
                        Get paid for your writing through our Partner Program and reader subscriptions.
                    </p>
                </div>
            </div>
        </section>
    )
}