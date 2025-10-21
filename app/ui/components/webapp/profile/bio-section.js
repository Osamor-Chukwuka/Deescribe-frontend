import {
    Calendar,
    Link2,
    Twitter,
    Github,
    Linkedin,
    Mail,
} from "lucide-react"
import { Button, FollowUser, formatDate, UnFollowUser, UpdateUser, useEffect, useState } from "@/app/ui/imports"
import { useUserStore } from "@/app/ui/imports"
import toast from "react-hot-toast";
import Error from "next/error";


export const BioSection = ({ user, isFollowing, setIsFollowing }) => {
    const currentUser = useUserStore((state) => state.user);
    const isProfileOwner = currentUser?.user?.id === user?.user?.id
    const [bio, setBio] = useState(user?.user?.bio)
    //follow states
    const [localIsFollowing, setLocalIsFollowing] = useState(user?.is_following)

    //handle follow/unfollow user
    const handleFollowUser = (following) => {
        if (following) return unfollowUser()
        return followUser()
    }

    //follow user
    const followUser = async () => {
        setLocalIsFollowing(user?.user?.id)

        try {
            const { response, jsonResponse, error } = await FollowUser(user?.user?.id)

            if (error) {
                throw new Error(error)
            }

            if (response.ok && jsonResponse?.status) {
                ''
            } else if (!response.ok || !jsonResponse?.status) {
                throw new Error(jsonResponse?.message || 'Could not follow user')
            }

        } catch (error) {
            toast.error(error.message || 'An error occurred while following user')
            setLocalIsFollowing(false)
            return
        }
    }

    //unfollow user
    const unfollowUser = async () => {
        setLocalIsFollowing(false)

        try {
            const { response, jsonResponse, error } = await UnFollowUser(user?.user?.id)

            if (error) { throw new Error(error) }

            if (response.ok && jsonResponse?.status) {
                ''
            } else if (!response.ok || !jsonResponse?.status) {
                throw new Error(jsonResponse?.message || 'Could not unfollow user')
            }

        } catch (error) {
            toast.error(error.message || 'An error occurred while unfollowing user')
            setLocalIsFollowing(user?.user?.id)
            return
        }
    }

    //handle bio update
    const handleBioUpdate = async (newBio) => {
        try {
            const payload = { bio: newBio }
            const { response, jsonResponse, error } = await UpdateUser(payload);

            if (error) throw new Error(error)

            if (response.ok && jsonResponse?.status) {
                toast.success("Bio updated successfully")
            } else {
                throw new Error(jsonResponse.message || "update failed")
            }
        } catch (error) {
            toast.error(error.message)
            setBio(bio + ' ')
            return
        }
    }

    return (
        <div>
            <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-3xl shadow-xl p-8">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1 space-y-4">
                        <p suppressContentEditableWarning onBlur={(e) => handleBioUpdate(e.currentTarget.textContent)} contentEditable={isProfileOwner} className="text-gray-700 text-lg leading-relaxed ">{bio}</p>

                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <p><span className="font-semibold text-base">{user?.resources_count?.following_count}</span> <span className="text-sm">Following</span></p>
                            <p><span className="font-semibold text-base">{user?.resources_count?.followers_count}</span> <span className="text-sm">Followers</span></p>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600">

                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                Joined {formatDate(user?.user?.created_at)}
                            </div>
                            <div className="flex items-center">
                                <Link2 className="h-4 w-4 mr-1" />
                                <a href={''} className="text-teal-600 hover:underline">
                                    dummy.dev
                                </a>
                            </div>
                        </div>
                    </div>
                    {console.log("user: ", user)}
                    {currentUser?.user?.id != user?.user?.id && (
                        <Button
                            onClick={() => handleFollowUser(localIsFollowing)}
                            className={`ml-6 px-8 rounded-xl ${localIsFollowing ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-primary text-white hover:bg-primary-hover"
                                }`}
                            variant={user?.user?.name ? "outline" : "default"}
                        >
                            {localIsFollowing ? "Following" : "Follow"}

                        </Button>
                    )}

                </div>

                {/* Social Links */}
                {/* <div className="flex items-center space-x-4">
                    <a
                        href={`https://twitter.com/${user.social.twitter.replace("@", "")}`}
                        className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
                    >
                        <Twitter className="h-4 w-4" />
                    </a>
                    <a
                        href={`https://github.com/${user.social.github}`}
                        className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        <Github className="h-4 w-4" />
                    </a>
                    <a
                        href={`https://linkedin.com/in/${user.social.linkedin}`}
                        className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
                    >
                        <Linkedin className="h-4 w-4" />
                    </a>
                    <a
                        href={`mailto:${user.social.email}`}
                        className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                    >
                        <Mail className="h-4 w-4" />
                    </a>
                </div> */}
            </div>
        </div>
    )
}