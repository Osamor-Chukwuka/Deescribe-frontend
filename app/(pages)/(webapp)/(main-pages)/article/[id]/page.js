'use client'

import { CreateBookmark, DeleteBookmark, FollowUser, GetPostApi, LikePostApi, UnFollowUser, UnlikePostApi } from '@/app/api/api';
import {
    Image, useState, Link, ArrowLeft, Heart, MessageCircle, Bookmark, Share2, Calendar, Clock, Eye, Send, ThumbsUp, Reply, Button, timeAgo, CommentSection,
    useEffect,
    FaHeart,
    FaRegHeart,
    SlateContentRenderer,
    FaBookmark,
    useUserStore,
    truncateText
} from '@/app/ui/imports'
import Error from 'next/error';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';


export default function ArticleDetails() {
    //global states
    const currentUser = useUserStore((state) => state.user);

    const [showComments, setShowComments] = useState(false)
    const [post, setPost] = useState(null)
    // error state
    const [postError, setPostError] = useState(null)
    const [loading, setLoading] = useState(true)
    // likes
    const [liked, setLiked] = useState(post?.post?.liked ?? false);
    const [likesCount, setLikesCount] = useState(post?.post?.likes_count ?? 0);
    //bookmark
    const [isBookmarked, setIsBookmarked] = useState(post?.post?.bookmarked ?? false);
    const [bookmarksCount, setBookmarksCount] = useState(post?.post?.bookmarks_count ?? 0);
    //Follow and unfollow
    const [localIsFollowing, setLocalIsFollowing] = useState(post?.post?.following)
    // params
    const params = useParams();
    const id = params.id;

    // get the post
    const fetchPost = async () => {
        try {
            const { response, jsonResponse, error } = await GetPostApi(id);
            if (error) {
                setPostError(error);
                setLoading(false);
                return;
            }

            if (response.ok) {
                console.log(jsonResponse)

                setPost(jsonResponse)
                setLocalIsFollowing(jsonResponse?.post?.following)
                setLiked(jsonResponse?.post?.liked)
                setLikesCount(jsonResponse?.post?.likes_count)
                setIsBookmarked(jsonResponse?.post?.bookmarked)
                setBookmarksCount(jsonResponse?.post?.bookmarks_count)

                setLoading(false);
            } else {
                setPostError(jsonResponse.message)
                setLoading(false)
                return
            }
        } catch (error) {
            setPostError(error.message)
            setLoading(false)
            return
        }
    }

    // handle like and unlike post
    const handleLikePost = async (e) => {
        e.preventDefault();

        // Optimistically flip the UI immediately:
        setLiked(prev => !prev);
        setLikesCount(count => count + (liked ? -1 : 1));

        try {
            let response, jsonResponse, error;

            if (liked) {
                // unlike
                ({ response, jsonResponse, error } = await UnlikePostApi(id));
            } else {
                // like
                ({ response, jsonResponse, error } = await LikePostApi(id));
            }

            // If it failed, rollback to previous state:
            if (error || !response.ok) {
                setLiked(prev => !prev);
                setLikesCount(count => count + (liked ? 1 : -1));
                toast.error(error || jsonResponse.message);
                return;
            }
        } catch (error) {
            // Network or unexpected error → rollback:
            setLiked(prev => !prev);
            setLikesCount(count => count + (liked ? 1 : -1));
            toast.error(err.message);
        }
    }

    // handle create bookmark
    const handleCreateBookmark = async (e, postId) => {
        e.preventDefault();

        if (isBookmarked) return toast.error("Already bookmarked");

        setIsBookmarked(true);
        setBookmarksCount(prev => prev + 1);

        try {
            const { response, jsonResponse, error } = await CreateBookmark(postId);
            if (error) {
                toast.error(error);
                return;
            }
            if (response.ok && jsonResponse.status) {
                return
            } else {
                setIsBookmarked(false); // Rollback if creation fails
                setBookmarksCount(prev => prev - 1);
                toast.error(jsonResponse.message);
            }

        } catch (error) {
            setIsBookmarked(false); // Rollback if creation fails
            setBookmarksCount(prev => prev - 1);
            toast.error(error.message);
            return;
        }
    }

    // handle delete bookmark
    const handleDeleteBookmark = async (e, postId) => {
        e.preventDefault();

        setIsBookmarked(false);
        setBookmarksCount(prev => prev - 1);

        try {
            const { response, jsonResponse, error } = await DeleteBookmark(postId);
            if (error) {
                toast.error(error);
                return;
            }
            if (response.ok && jsonResponse.status) {
                return
            } else {
                setIsBookmarked(true); // Rollback if deletion fails
                setBookmarksCount(prev => prev + 1);
                toast.error(jsonResponse.message);
                return;
            }

        } catch (error) {
            setIsBookmarked(true); // Rollback if deletion fails
            setBookmarksCount(prev => prev + 1);
            toast.error(error.message);
            return;
        }

    }

    //follow a user
    const handleFollowUser = async (userId) => {
        setLocalIsFollowing(userId)

        try {
            const { response, jsonResponse, error } = await FollowUser(userId)

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

    //Unfollow a user
    const handleUnFollowUser = async (userId) => {
        setLocalIsFollowing(false)

        try {
            const { response, jsonResponse, error } = await UnFollowUser(userId)

            if (error) {
                throw new Error(error)
            }

            if (response.ok && jsonResponse?.status) {
                ''
            } else if (!response.ok || !jsonResponse?.status) {
                throw new Error(jsonResponse?.message || 'Could not unfollow user')
            }

        } catch (error) {
            toast.error(error.message || 'An error occurred while unfollowing user')
            setLocalIsFollowing(userId)
            return
        }
    }

    useEffect(() => {
        fetchPost()
    }, []);


    const toggleComments = () => setShowComments(prev => !prev)

    if (loading) return 'loading...'

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-2 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to articles
                    </Link>
                </div>
            </header>

            <main className="lg:max-w-6xl mx-auto lg:px-6 py-8 space-y-8">
                {/* Title */}
                <article className="bg-white rounded-lg p-8 space-y-6">
                    <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                        {post?.post?.title}
                    </h1>

                    <p className="text-xl text-gray-600">{post?.post?.subtitle}</p>


                    {/* Meta */}
                    <div className="flex flex-wrap justify-between items-center text-gray-500 text-sm">
                        <div className="flex items-center space-x-4">
                            <Image
                                src={post?.post?.user?.profile_image}
                                alt={post?.post?.user?.name}
                                width={100}
                                height={100}
                                className="lg:w-16 w-22 h-16 rounded-full"
                            />
                            <div>
                                {console.log("single article: ", post)}
                                <div className="flex items-center space-x-2">
                                    <Link href={`/profile/${post?.post?.user?.id}`} className="font-semibold text-gray-900 hover:text-primary-hover cursor-pointer">{post?.post?.user?.name}</Link>

                                    {currentUser?.user?.id != post?.post?.user?.id && (
                                        localIsFollowing ?
                                            <button onClick={() => handleUnFollowUser(post?.post?.user?.id)} className="text-xs  border px-2 py-1 rounded-full text-gray-400 border-gray-400 hover:border-red-500 cursor-pointer hover:bg-red-400 hover:text-white">Following</button>
                                            :
                                            <button onClick={() => handleFollowUser(post?.post?.user?.id)} className="text-xs  border px-2 py-1 rounded-full text-primary border-primary cursor-pointer hover:bg-primary-hover hover:text-white">Follow +</button>

                                    )}

                                </div>
                                <p className='pt-1'>{truncateText(post?.post?.user?.bio, 40)}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6 mt-4 md:mt-0">
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" /><span>{timeAgo(post?.post?.created_at)}</span>
                            </div>
                            {/* <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" /><span>{'8 min read'}</span>
                            </div> */}

                        </div>
                    </div>

                    {/* Images */}
                    <div className='flex flex-col justify-center w-full items-center'>
                        {post?.post?.images?.map((img, i) => (
                            <figure key={i} className="pb-5 w-full ">
                                <Image
                                    width={2000}
                                    height={2000}
                                    src={img}
                                    alt={'image'}
                                    className=" mx-auto w-full rounded-lg shadow"
                                />
                                <figcaption className="text-sm text-gray-600 italic text-center">
                                    {'image ' + (i + 1)}
                                </figcaption>
                            </figure>
                        ))}
                    </div>

                    {/* Content */}
                    <div className='whitespace-pre-wrap	 prose prose-lg'>
                        {console.log("fetched content", JSON.parse(post?.post?.content))}
                        <SlateContentRenderer content={JSON.parse(post?.post?.content)} />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {post?.post?.categories.map(cat => (
                            <span
                                key={cat.id}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                            >
                                {cat?.name}
                            </span>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-6">
                            <div className={`flex items-center gap-1 cursor-pointer ${liked ? 'text-red-500' : ''} hover:text-red-500`}>
                                {liked ?
                                    <FaHeart className='text-red-500' onClick={(e) => handleLikePost(e)} />
                                    :
                                    <FaRegHeart className='' onClick={(e) => handleLikePost(e)} />
                                }
                                {likesCount}

                            </div>
                            <button
                                onClick={toggleComments}
                                className="flex cursor-pointer items-center space-x-1 text-gray-600 hover:text-teal-600"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span>{post?.post?.comments_count}</span>
                            </button>
                            <button className="flex cursor-pointer items-center space-x-1 text-gray-600 hover:text-teal-600">
                                {isBookmarked ?
                                    <FaBookmark onClick={(e) => handleDeleteBookmark(e, post?.post?.id)} className={`w-5 h-5 text-primary`} />
                                    :
                                    <Bookmark onClick={(e) => handleCreateBookmark(e, post?.post?.id)} className={`w-5 h-5`} />
                                }
                                <span>{bookmarksCount}</span>
                            </button>
                        </div>
                        <Button variant="outline">
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                    </div>
                </article>

                {/* Comments */}
                {showComments && (
                    <CommentSection fetchPost={fetchPost} currentUserImage={currentUser?.user?.profile_image} userImage={post?.post?.user?.profile_image} postId={post?.post?.id} />
                )}

                {/* Author card & related articles can be added similarly */}
            </main>
        </div>
    )
}
