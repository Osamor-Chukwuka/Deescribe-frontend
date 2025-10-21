import {
    Users,
    Award,
    TrendingUp,
    Heart,
} from "lucide-react"

export const UserAbout = () => {

    const achievements = [
        { icon: Award, title: "Top Writer", description: "CSS & Frontend Development", color: "text-yellow-500" },
        {
            icon: TrendingUp,
            title: "Trending Author",
            description: "Most read articles this month",
            color: "text-green-500",
        },
        { icon: Users, title: "Community Leader", description: "10K+ followers milestone", color: "text-blue-500" },
        { icon: Heart, title: "Reader's Choice", description: "Highest engagement rate", color: "text-red-500" },
    ]

    return (
        <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">🏆 Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                            <achievement.icon className={`h-8 w-8 ${achievement.color}`} />
                            <div>
                                <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                                <p className="text-sm text-gray-600">{achievement.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skills & Interests */}
            <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">💡 Skills & Interests</h3>
                <div className="flex flex-wrap gap-3">
                    {[
                        "CSS",
                        "JavaScript",
                        "React",
                        "Vue.js",
                        "Design Systems",
                        "UI/UX Design",
                        "Frontend Architecture",
                        "Web Performance",
                        "Accessibility",
                        "TypeScript",
                        "Node.js",
                        "GraphQL",
                    ].map((skill) => (
                        <span
                            key={skill}
                            className="px-4 py-2 bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 rounded-full font-medium"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}