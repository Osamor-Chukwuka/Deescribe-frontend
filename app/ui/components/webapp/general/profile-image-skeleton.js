export const ProfileImageSkeleton = () => {
    return (
        <div className="relative">
            
            <div className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl bg-gray-200 animate-pulse"></div>

            <div className="absolute -top-2 -right-1 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border-2 border-white animate-pulse"></div>
        </div>

    )
}