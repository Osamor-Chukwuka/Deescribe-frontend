export const CoverImageSkeleton = () => {
    return (
        <div class="relative h-64 bg-gray-200 rounded-3xl overflow-hidden shadow-xl animate-pulse">

            <div class="w-full h-full bg-gray-300"></div>


            <div class="absolute -top-2 -right-1 w-12 h-12 bg-gray-300 rounded-full border-2 border-white animate-pulse"></div>
        </div>
    )
}