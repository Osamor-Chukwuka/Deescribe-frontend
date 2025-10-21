'use client'
import { FaRegHeart, FaRegComment, Image, timeAgo, useState, useEffect, LikePostApi, UnlikePostApi, FaHeart, useRouter, truncateText, useUserStore, FollowUser, Link } from '@/app/ui/imports'
import toast from 'react-hot-toast';


export default function ArticleCard({ setReRenderSuggestedProfile, index, article, setLocalIsFollowing, localIsFollowing }) {
    //global state
    const user = useUserStore((state) => state.user)
    //local states
    const [liked, setLiked] = useState(article.liked);
    const [likesCount, setLikesCount] = useState(article.likes_count);
    const [selectedProfile, setSelectedProfile] = useState(null)
    const router = useRouter();

    // handle like and unlike post
    const handleLikePost = async (e, postId) => {
        e.preventDefault();

        // Optimistically flip the UI immediately:
        setLiked(prev => !prev);
        setLikesCount(count => count + (liked ? -1 : 1));

        try {
            let response, jsonResponse, error;

            if (liked) {
                // unlike
                ({ response, jsonResponse, error } = await UnlikePostApi(postId));
            } else {
                // like
                ({ response, jsonResponse, error } = await LikePostApi(postId));
            }

            // If it failed, rollback to previous state:
            if (error || !response.ok) {
                setLiked(prev => !prev);
                setLikesCount(count => count + (liked ? 1 : -1));
                console.error("Error toggling like:", error || jsonResponse.message);
                return;
            }
        } catch (error) {
            // Network or unexpected error → rollback:
            setLiked(prev => !prev);
            setLikesCount(count => count + (liked ? 1 : -1));
            console.error("Network error toggling like:", err.message);
        }
    }

    // handle redirect to article detail page
    const handleRedirectToDetailsPage = (e, articleId) => {
        e.preventDefault();
        router.push(`/article/${articleId}`);
    };

    //follow a user
    const handleFollowUser = async (userId) => {
        setSelectedProfile(userId)
        setLocalIsFollowing(userId) //at this point...I think there's a better way to do this

        try {
            const { response, jsonResponse, error } = await FollowUser(userId)

            if (error) {
                toast.error(error)
                setSelectedProfile(null)
                setLocalIsFollowing(null)
                return
            }

            if (response.ok && jsonResponse?.status) {
                setTimeout(() => {
                    setSelectedProfile(null)
                    setReRenderSuggestedProfile(prev => prev + 1)
                }, 1000);
            } else if (!response.ok || !jsonResponse?.status) {
                toast.error(jsonResponse?.message || 'Could not follow user')
                setSelectedProfile(null)
                setLocalIsFollowing(null)
                return
            }

        } catch (error) {
            toast.error(error.message || 'An error occurred while following user')
            setSelectedProfile(null)
            setLocalIsFollowing(null)
            return
        }
    }

    return (
        <div className='lg:flex items-end space-x-2  bg-white w-full p-4 rounded-lg shadow-sm border border-gray-200'>
            <div key={index} className=" space-y-2 w-full">
                <h3 onClick={(e) => handleRedirectToDetailsPage(e, article.id)} className="font-semibold cursor-pointer text-lg hover:text-primary-hover text-gray-900">
                    {article.title}
                </h3>
                <p className="tex text-gray-500 mb-1">
                    {article.subtitle}
                </p>

                <div className='lg:flex justify-between items-end'>
                    <div>
                        <div className="text-sm hidden lg:flex text-gray-400 pt-5 items-center h-full  mt-1 gap-1">

                            <Image
                                width={100}
                                height={100}
                                src={article?.user?.profile_image}
                                alt={article.user.name}
                                className="w-16 h-16 rounded-full"
                            />
                            <div className='flex flex-col space-y-1 justify-end h-full'>
                                <span className="ms-1 font-medium space-x-3 text-gray-700 h-full">
                                    <Link href={`/profile/${article.user.id}`} className='cursor-pointer hover:text-primary'>{article.user.name}</Link>
                                </span>



                                <span className="ms-1 text-xs font-medium space-x-3 text-gray-700 h-full">
                                    <span className='text-gray-500 font-normal'>{timeAgo(article.created_at)}</span>
                                    <span className='text-gray-500 font-normal'>{'10 min read'}</span>
                                    {console.log("article user id: ", article?.user?.id)}
                                </span>


                                <div>
                                    {((!article?.following && localIsFollowing != article?.user?.id) && article?.user?.id != user?.user?.id) && (selectedProfile != article?.user?.id) && (
                                        <button onClick={() => handleFollowUser(article?.user?.id)} className="text-xs  border px-2 py-1 rounded-full text-primary border-primary cursor-pointer hover:bg-primary-hover hover:text-white">Follow +</button>
                                    )}

                                    {selectedProfile == article?.user?.id && (
                                        <button className="text-xs  border px-2 py-1 rounded-full text-primary border-primary cursor-pointer hover:bg-primary-hover hover:text-white">Following</button>
                                    )}

                                </div>


                            </div>

                        </div>
                    </div>
                    <div className='hidden lg:flex flex-col justify-end items-end'>
                        <div className="flex flex-wrap gap-2 pb-4">
                            {article?.categories.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
                            <div className={`flex items-center gap-1 cursor-pointer ${liked ? 'text-red-500' : ''} hover:text-red-500`}>
                                {liked ?
                                    <FaHeart className='text-red-500' onClick={(e) => handleLikePost(e, article?.id)} />
                                    :
                                    <FaRegHeart className='' onClick={(e) => handleLikePost(e, article?.id)} />
                                }
                                {likesCount}

                            </div>
                            <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
                                <FaRegComment /> {article.comments_count}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='lg:max-w-56 w-full pt-4'>
                <img
                    src={article?.images[0]}
                    alt={article.title}
                    className="lg:w-44 w-full h-36 object-cover rounded-2xl flex-shrink-0"
                />
            </div>

            {/* mobile screen */}
            <div className=' lg:hidden justify-end items-end pt-5'>
                <div className="flex flex-wrap gap-2 pb-2">
                    {article?.categories.map((tag, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>

                <div className="flex ps-2 items-center gap-4 mt-2 text-gray-500 text-sm">
                    <div className={`flex items-center gap-1 cursor-pointer ${liked ? 'text-red-500' : ''} hover:text-red-500`}>
                        {liked ?
                            <FaHeart className='text-red-500' onClick={(e) => handleLikePost(e, article?.id)} />
                            :
                            <FaRegHeart className='' onClick={(e) => handleLikePost(e, article?.id)} />
                        }
                        {likesCount}

                    </div>
                    <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
                        <FaRegComment /> {article.comments_count}
                    </div>
                </div>
            </div>

            <div className="text-sm flex lg:hidden text-gray-400 pt-5 items-center h-full  mt-1 gap-1">

                <Image
                    width={100}
                    height={100}
                    src={article?.user?.profile_image}
                    alt={article.user.name}
                    className="w-16 h-16 rounded-full"
                />
                <div className='flex flex-col space-y-1 justify-end h-full'>
                    <span className="ms-1 font-medium space-x-3 text-gray-700 h-full">
                        <Link href={`/profile/${article.user.id}`} className='cursor-pointer hover:text-primary'>{article.user.name}</Link>
                    </span>



                    <span className="ms-1 text-xs font-medium space-x-3 text-gray-700 h-full">
                        <span className='text-gray-500 font-normal'>{timeAgo(article.created_at)}</span>
                        <span className='text-gray-500 font-normal'>{'10 min read'}</span>
                        {console.log("article user id: ", article?.user?.id)}
                    </span>


                    <div>
                        {((!article?.following && localIsFollowing != article?.user?.id) && article?.user?.id != user?.user?.id) && (selectedProfile != article?.user?.id) && (
                            <button onClick={() => handleFollowUser(article?.user?.id)} className="text-xs  border px-2 py-1 rounded-full text-primary border-primary cursor-pointer hover:bg-primary-hover hover:text-white">Follow +</button>
                        )}

                        {selectedProfile == article?.user?.id && (
                            <button className="text-xs  border px-2 py-1 rounded-full text-primary border-primary cursor-pointer hover:bg-primary-hover hover:text-white">Following</button>
                        )}

                    </div>


                </div>

            </div>
        </div>
    )
}