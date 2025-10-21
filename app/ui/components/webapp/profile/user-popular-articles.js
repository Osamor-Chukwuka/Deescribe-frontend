import { GetUserPostsApi } from "@/app/api/api"
import {
    Heart,
    Eye,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { UserPopularArticlesSkeleton } from "./popular-articles-skeleton"

export const UserPopularArticles = ({ userId }) => {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const getUserArticles = async () => {
        setLoading(true)
        setError(null)

        try {
            const { response, jsonResponse, error } = await GetUserPostsApi(userId, 'likes');
            if (error) {
                setError(error);
                toast.error(error);
                return;
            }

            if (response?.ok && jsonResponse?.status) {
                console.log("User high posts fetched successfully", jsonResponse?.posts)
                setArticles(jsonResponse?.posts)
            } else {
                setError("Failed to fetch user posts")
                toast.error(jsonResponse.message || "failed to fetch user posts")
                console.log("Failed to fetch user high posts", jsonResponse)
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
        return <UserPopularArticlesSkeleton />
    }

    if (error) {
        return <div className="flex justify-center">
            <p className="text-red-300">{error}</p>
        </div>
    }

    if (!error && !loading && articles.length < 1) {
        return (
            <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-3xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Articles</h3>
                <div className="space-y-4 min-h-32 flex flex-col justify-center items-center">
                    <p className="text-gray-500 text-center">no posts yet</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Articles</h3>
            <div className="space-y-4">
                {articles?.map((article, index) => (
                    <Link key={article.id} href={`/article/${article.id}`} className="block group">
                        <div className="flex items-start space-x-3">
                            <span className="text-2xl font-bold text-teal-600 mt-1">{'•'}</span>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2">
                                    {article.title}
                                </h4>
                                <p className=" text-gray-500 text-sm line-clamp-2">
                                    {article.subtitle}
                                </p>

                                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                                    <Heart className="h-3 w-3" />
                                    <span>{article.likes_count}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}