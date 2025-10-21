export const UserPopularArticlesSkeleton = () => {
    return (
        <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Popular Articles
            </h3>

            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-start space-x-3">
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="flex items-center space-x-2">
                                <div className="h-3 w-3 bg-gray-200 rounded-full" />
                                <div className="h-3 w-8 bg-gray-200 rounded" />
                                <div className="h-3 w-3 bg-gray-200 rounded-full" />
                                <div className="h-3 w-8 bg-gray-200 rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}