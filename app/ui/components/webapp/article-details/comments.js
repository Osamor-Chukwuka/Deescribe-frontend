import { Button, Send, Reply, ThumbsUp, useState, GetComments, useEffect, timeAgo, CreateComments } from '@/app/ui/imports'
import toast from 'react-hot-toast';


export function CommentSection({ fetchPost, currentUserImage, userImage, postId }) {
    const [newComment, setNewComment] = useState('')
    const [comments, setComments] = useState([])
    // loading
    const [loading, setLoading] = useState(true);
    const [addLoading, setAddLoading] = useState(false)

    // get the comments of a post
    const fetchComments = async () => {
        try {
            const { response, jsonResponse, error } = await GetComments(postId);
            if (error) {
                toast.error(error);
                setLoading(false);
                return;
            }

            if (response.ok) {
                console.log("fetched comments: ", jsonResponse)
                setComments(jsonResponse)
                setLoading(false);
            } else {
                toast.error(jsonResponse.message)
                setLoading(false)
                return
            }
        } catch (error) {
            toast.error(error.message)
            setLoading(false)
            return
        }
    }

    useEffect(() => {
        fetchComments()
    }, []);


    const submitComment = async (e) => {
        e.preventDefault()
        setAddLoading(true)

        if (newComment.length < 1) {
            setAddLoading(false)
            return toast.error('Cannot submit empty comments', {
                style: {
                    padding: '18px',
                }
            })
        }

        try {
            const { response, jsonResponse, error } = await CreateComments(postId, newComment);
            if (error) {
                toast.error(error);
                setAddLoading(false)
                return;
            }

            if (response.ok) {
                console.log(jsonResponse)
                setNewComment('')
                setAddLoading(false)

                fetchPost() //re-fetch post to update comments count
                fetchComments() //re-fetch comments
            } else {
                toast.error(jsonResponse.message)
                setAddLoading(false)
                return
            }
        } catch (error) {
            toast.error(error.message)
            setAddLoading(false)
            return
        }
    }

    if (loading) return 'loading...'

    return (
        <div>
            <section className="bg-white rounded-lg p-6 space-y-6">
                <h3 className="text-lg font-semibold">
                    Comments ({comments?.comments_count})
                </h3>

                {/* New comment */}
                <form onSubmit={submitComment} className="flex space-x-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        <img
                            src={currentUserImage}
                            alt={'your image'}
                            className="w-10 h-10 rounded-full"
                        />
                    </div>
                    <div className="flex-1">
                        <textarea
                            rows={3}
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="What are your thoughts?"
                            className="w-full p-3 border rounded-lg focus:ring-teal-500"
                        />
                        <div className="flex justify-end mt-2">
                            <Button type={'submit'} size="sm" className='disabled:cursor-not-allowed disabled:bg-gray-400' disabled={addLoading}>
                                <Send className="w-4 h-4 mr-1" /> Comment
                            </Button>
                        </div>
                    </div>
                </form>

                {/* Comment list */}
                {comments.comments.map(c => (
                    <div key={c.id} className="space-y-4">
                        <div className="flex space-x-4">
                            <img
                                src={c.user.profile_image}
                                alt={c.user.name}
                                className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span className="font-medium text-gray-900">{c.user.name}</span>
                                    <span>{timeAgo(c.created_at)}</span>
                                </div>
                                <p className="text-gray-700">{c.content}</p>
                                <div className="flex space-x-4 mt-2 text-gray-500">
                                    {/* <button className="flex items-center space-x-1 hover:text-teal-600">
                                        <ThumbsUp className="w-4 h-4" /><span>{'18'}</span>
                                    </button>
                                    <button className="flex items-center space-x-1 hover:text-teal-600">
                                        <Reply className="w-4 h-4" /><span>Reply</span>
                                    </button> */}
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </section>
        </div>
    )
}