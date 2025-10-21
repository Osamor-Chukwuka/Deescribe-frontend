import React from 'react'

export function SuggestedForYouSkeleton({ count = 4 }) {
    return (
        <aside className="w-full lg:w-80 bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-fit animate-pulse">
            {/* Header */}
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-6"></div>
            {/* Suggestions List */}
            <div className="space-y-6">
                {Array.from({ length: count }).map((_, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                                </div>
                            </div>
                            <div className="space-y-2 pl-14">
                                <div className="h-3 bg-gray-200 rounded w-full" />
                                <div className="h-3 bg-gray-200 rounded w-5/6" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                        </div>
                        <div className="w-16 h-8 bg-gray-200 rounded-full ml-4" />
                    </div>
                ))}
            </div>
            {/* Footer Link */}
            <div className="mt-6">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
        </aside>
    )
}
