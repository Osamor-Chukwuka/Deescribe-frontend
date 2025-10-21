export const UserActivity = () => {

    const recentActivity = [
        {
            type: "published",
            title: "Building Better User Interfaces with Modern CSS",
            time: "2 days ago",
            stats: "2.4K views",
        },
        {
            type: "liked",
            title: "The Future of Web Development",
            author: "Alex Thompson",
            time: "3 days ago",
        },
        {
            type: "commented",
            title: "React Performance Optimization Tips",
            author: "Maya Patel",
            time: "5 days ago",
        },
        {
            type: "followed",
            user: "David Kim",
            time: "1 week ago",
        },
    ]

    return (
        <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-3xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">📈 Recent Activity</h3>
            <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                    <div
                        key={index}
                        className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors"
                    >
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <div className="flex-1">
                            {activity.type === "published" && (
                                <p className="text-gray-700">
                                    <span className="font-medium">Published</span> "{activity.title}" • {activity.stats} •{" "}
                                    {activity.time}
                                </p>
                            )}
                            {activity.type === "liked" && (
                                <p className="text-gray-700">
                                    <span className="font-medium">Liked</span> "{activity.title}" by {activity.author} •{" "}
                                    {activity.time}
                                </p>
                            )}
                            {activity.type === "commented" && (
                                <p className="text-gray-700">
                                    <span className="font-medium">Commented on</span> "{activity.title}" by{" "}
                                    {activity.author} • {activity.time}
                                </p>
                            )}
                            {activity.type === "followed" && (
                                <p className="text-gray-700">
                                    <span className="font-medium">Started following</span> {activity.user} • {activity.time}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}