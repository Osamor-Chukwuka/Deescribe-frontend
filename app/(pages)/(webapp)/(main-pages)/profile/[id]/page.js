"use client"

import React, { useEffect, useState } from "react"
import {
    Share2,
    MessageCircle,
    Bookmark,
    Users,
    FileText,
    Clock,
} from "lucide-react"
import Link from "next/link"
import { BioSection, Button, GetUserProfile, ProfileImages, UserAbout, UserActivity, UserArticles, UserPopularArticles, UserQuickAction } from "@/app/ui/imports"
import toast from "react-hot-toast"

export default function ProfilePage({ params }) {
    const [activeTab, setActiveTab] = useState("articles")
    //follow state
    const [isFollowing, setIsFollowing] = useState(false)
    //user profile states
    const [userProfile, setUserProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { id } = React.use(params);

    //get user profile
    const fetchUserProfile = async () => {
        setLoading(true)
        setError(null)

        try {
            const { response, jsonResponse, error } = await GetUserProfile(id);
            if (error) {
                setError(error);
                toast.error(error);
                return;
            }

            if (response?.ok && jsonResponse?.status) {
                console.log("User profile fetched successfully", jsonResponse?.data)
                setUserProfile(jsonResponse?.data)
            } else {
                setError("Failed to fetch user profile")
                toast.error("Failed to fetch user profile")
                console.log("Failed to fetch user profile", jsonResponse)
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
        fetchUserProfile()
    }, [])

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

            {/* Cover & Profile Section */}
            <div className="pt-10 pb-8 lg:px-4">
                <div className="lg:max-w-8xl mx-auto">
                    {/* Cover Image */}
                    <ProfileImages userProfile={userProfile} />

                    {/* Profile Content */}
                    <div className="mt-20">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Bio & Actions */}
                                <BioSection user={userProfile} />

                                {/* Navigation Tabs */}
                                <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-2xl p-2 shadow-lg">
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={() => setActiveTab("articles")}
                                            className={`flex items-center cursor-pointer px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "articles"
                                                ? "bg-teal-600 text-white shadow-lg"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                }`}
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            Articles ({userProfile?.resources_count?.posts_count || 0})
                                        </button>
                                        {/* FOR V2 */}
                                        {/* <button
                                            onClick={() => setActiveTab("about")}
                                            className={`flex items-center cursor-pointer px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "about"
                                                ? "bg-teal-600 text-white shadow-lg"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                }`}
                                        >
                                            <Users className="h-4 w-4 mr-2" />
                                            About
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("activity")}
                                            className={`flex items-center cursor-pointer px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "activity"
                                                ? "bg-teal-600 text-white shadow-lg"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                }`}
                                        >
                                            <Clock className="h-4 w-4 mr-2" />
                                            Activity
                                        </button> */}
                                    </div>
                                </div>

                                {/* Tab Content */}
                                {activeTab === "articles" && id && (
                                    <UserArticles userId={id} />
                                )}

                                {activeTab === "about" && (
                                    <UserAbout />
                                )}

                                {activeTab === "activity" && (
                                    <UserActivity />
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1 space-y-6">

                                {/* Popular Articles */}
                                <UserPopularArticles userId={id} />

                                {/* Quick Actions */}
                                <UserQuickAction />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
