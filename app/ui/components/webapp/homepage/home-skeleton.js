import React from 'react';

export default function HomeSkeleton() {
    return (
        <main className="flex-1 space-y-6 animate-pulse w-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-glow pointer-events-none">
            
            {/* Article cards skeleton */}
            <div className="space-y-4">
                {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 flex flex-col lg:flex-row gap-4">
                        <div className="h-32 bg-gray-200 rounded w-full lg:w-1/4" />
                        <div className="flex-1 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                        </div>
                    </div>
                ))}
            </div>
            {/* Load more button skeleton */}
            <div className="flex justify-center">
                <div className="h-8 bg-gray-200 rounded w-32" />
            </div>
        </main>
    );
}
