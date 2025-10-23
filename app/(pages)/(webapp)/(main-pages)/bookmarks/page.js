"use client"

import { useEffect, useState } from "react"
import {
    ArrowLeft,
    Search,
    BookMarked as BookmarkOff,
    Heart,
    MessageCircle,
    Share2,
    MoreHorizontal,
    Eye,
} from "lucide-react"
import Link from "next/link"
import { Button, FaBookmark, GetBookmarks, timeAgo, Bookmark } from "@/app/ui/imports"
import Error from "next/error"
import toast from "react-hot-toast"
import { DeleteBookmark, GetPostApi } from "@/app/api/api"

export default function BookmarksPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [bookmarks, setBookmarks] = useState([])
    const [isBookmarked, setIsBookmarked] = useState({ id: null, status: true })
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const getBookmarks = async () => {
        setBookmarks([])
        setPosts([])
        setLoading(true);
        try {
            const { response, jsonResponse, error } = await GetBookmarks(searchQuery);
            if (error) {
                throw new Error(error)
            }

            if (response.ok) {
                console.log(jsonResponse)
                setBookmarks(jsonResponse?.bookmarks)

                // Fetch all posts in parallel for each bookmark
                await Promise.all(jsonResponse?.bookmarks.map(book => {
                    fetchPost(book.post_id, book.bookmark_id)
                }))

            } else {
                throw new Error(jsonResponse.message)
            }
        } catch (error) {
            setError(error.message || "something went wrong")
            toast.error(error.message || "something went wrong")

        } finally {
            setLoading(false)
        }
    }


    const fetchPost = async (postId, bookmarkId) => {
        setLoading(true);
        try {
            const { response, jsonResponse, error } = await GetPostApi(postId);
            if (error) {
                throw new Error(error)
            }

            if (response.ok) {
                console.log(jsonResponse)
                setPosts(prev => {
                    const exists = prev.some(p => p.post.id === jsonResponse?.post.id);
                    if (exists) return prev;
                    return [...prev, { post: jsonResponse?.post, bookmark: bookmarkId }];
                });
            } else {
                throw new Error(jsonResponse.message)
            }
        } catch (error) {
            setError(error.message || "something went wrong")
            toast.error(error.message || "something went wrong")
            setLoading(false)
            return
        }
    }


    const handleRemoveBookmark = async (postId) => {

        setIsBookmarked({ id: postId, status: false });

        try {
            const { response, jsonResponse, error } = await DeleteBookmark(postId);
            if (error) {
                throw new Error(error)
            }
            if (response.ok && jsonResponse.status) {
                getBookmarks()
            } else {
                throw new Error(jsonResponse.message)
            }

        } catch (error) {
            setIsBookmarked({ id: null, status: false }); // Rollback if deletion fails
            toast.error(error.message || 'something went wrong');
            return;
        }
    }

    useEffect(() => {
        getBookmarks()
    }, [])

    useEffect(() => {
        getBookmarks()
    }, [searchQuery])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">


            {/* Main Content */}
            <div className="pt-10 pb-8 px-1">
                <div className=" mx-auto">
                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Bookmarks</h1>
                        <p className="text-gray-600">Curated collection of articles you've saved</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar - Desktop */}
                        <div className="hidden lg:block">
                            <div className="sticky top-28 space-y-6">
                                {/* Search */}
                                <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-3xl shadow-xl p-6">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search bookmarks..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Mobile Filters check v0 for the code */}


                        {/* Main Content */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Search Bar - Mobile */}
                            <div className="lg:hidden">
                                <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-2xl shadow-lg p-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search bookmarks..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bookmarks List */}

                            {loading ? '' :
                                posts.length > 0 ? (

                                    <div className="space-y-4 sm:space-y-6">
                                        {console.log("omo posts: ", posts)}
                                        {posts.map((post) => (
                                            <div
                                                key={post?.bookmark + post.post.id}
                                                className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all overflow-hidden group"
                                            >
                                                {console.log('single post: ', post)}
                                                <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                                                    {/* Image - Hidden on very small screens */}
                                                    <div className="hidden sm:block flex-shrink-0">
                                                        <img
                                                            src={post.post.images[0]}
                                                            alt={post.post.title}
                                                            className="w-32 h-24 object-cover rounded-xl group-hover:scale-105 transition-transform"
                                                        />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <Link href={`/article/${post.post.id}`} className="block group">
                                                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                                                                {post.post.title}
                                                            </h3>
                                                            <p className="text-gray-600 text-sm sm:text-base mb-3 line-clamp-2">{post.post.subtitle}</p>
                                                        </Link>

                                                        {/* Author and Meta */}
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                                                            <div className="flex items-center space-x-2">
                                                                <img
                                                                    src={post?.post?.user?.profile_image || "/placeholder.svg"}
                                                                    alt={post?.post?.user?.name}
                                                                    className="w-6 h-6 rounded-full"
                                                                />
                                                                <span className="text-sm text-gray-700 font-medium">{post?.post?.user?.name}</span>
                                                            </div>
                                                            <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-500">
                                                                <span>{timeAgo(post.post.created_at)}</span>
                                                                <span>•</span>
                                                            </div>
                                                        </div>

                                                        {/* Tags */}
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {post.post.categories.map((tag) => (
                                                                <span
                                                                    key={tag.name}
                                                                    className="px-2.5 py-1 bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 text-xs font-medium rounded-full"
                                                                >
                                                                    {tag.name}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        {/* Stats - Responsive */}
                                                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200">
                                                            <div className="flex items-center space-x-3 sm:space-x-6">
                                                                <div className="flex items-center space-x-1 text-gray-600">
                                                                    <Heart className=" h-4 w-4" />
                                                                    <span className="text-sm">{post.post.likes_count}</span>
                                                                </div>
                                                                <div className="hidden sm:flex items-center space-x-1 text-gray-600">
                                                                    <MessageCircle className=" h-4 w-4" />
                                                                    <span className="text-sm">{post.post.comments_count}</span>
                                                                </div>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex items-center space-x-2">
                                                                <button className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                                                                    <Share2 className="cursor-pointer h-5 w-5" />
                                                                </button>
                                                                {isBookmarked.id == post.post.id && isBookmarked.status == false ?
                                                                    <button
                                                                        onClick={() => handleRemoveBookmark(post.post.id)}
                                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    >
                                                                        <Bookmark className="cursor-pointer h-5 w-5 text-primary" />
                                                                    </button>
                                                                    :
                                                                    <button
                                                                        onClick={() => handleRemoveBookmark(post.post.id)}
                                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    >
                                                                        <FaBookmark className="cursor-pointer h-5 w-5 text-primary" />
                                                                    </button>
                                                                }




                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-3xl shadow-xl p-12 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <BookmarkOff className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookmarks found</h3>
                                        <p className="text-gray-600 mb-6">
                                            {searchQuery
                                                ? "Try adjusting your search"
                                                : "Start bookmarking articles to save them for later"}
                                        </p>
                                        <Link href="/">
                                            <Button className="rounded-xl">Browse Articles</Button>
                                        </Link>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
