import { GetUserPostsApi } from "@/app/api/api"
import {
    Heart,
    MessageCircle,
    Eye,
    MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import HomeSkeleton from "../../homepage/home-skeleton"
import toast from "react-hot-toast"
import { timeAgo } from "@/app/utils/time-ago"

export const UserArticles = ({ userId }) => {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const getUserArticles = async () => {
        setLoading(true)
        setError(null)

        try {
            const { response, jsonResponse, error } = await GetUserPostsApi(userId);
            if (error) {
                setError(error);
                toast.error(error);
                return;
            }

            if (response?.ok && jsonResponse?.status) {
                console.log("User posts fetched successfully", jsonResponse?.posts)
                setArticles(jsonResponse?.posts)
            } else {
                setError("Failed to fetch user posts")
                toast.error(jsonResponse.message || "failed to fetch user posts")
                console.log("Failed to fetch user posts", jsonResponse)
            }
        }
        catch (error) {
            setError(error.message)
            toast.error(error.message)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUserArticles()
    }, [])

    if (loading) {
        return <HomeSkeleton />
    }

    if (error) {
        return <div className="flex justify-center">
            <p className="text-red-300">{error}</p>
        </div>
    }

    if (!error && !loading && articles.length < 1) {
        return <div className="flex justify-center">
            <p className="text-gray-500">no posts yet</p>
        </div>
    }

    return (
        <div className="space-y-6">
            {articles?.map((article) => (
                <div
                    key={article.id}
                    className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all group"
                >
                    <div className="lg:flex space-x-6">
                        <div className="flex-1">
                            <Link href={`/article/${article.id}`} className="block group">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-gray-600 mb-4 leading-relaxed">{article.subtitle}</p>
                            </Link>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>{timeAgo(article.created_at)}</span>
                                    <span>•</span>
                                    <span>{'5 min'}</span>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1 text-gray-500">
                                        <Heart className="h-4 w-4" />
                                        <span className="text-sm">{article.likes_count}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-gray-500">
                                        <MessageCircle className="h-4 w-4" />
                                        <span className="text-sm">{article.comments_count}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {article?.categories.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 text-sm rounded-full"
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <img
                            src={article?.images[0]}
                            alt={article.title}
                            className="lg:w-32 w-full h-32 mt-4 lg:mt-0 object-cover rounded-2xl flex-shrink-0"
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}