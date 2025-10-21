'use client';
import { AppNavbar, ArticleCard, SuggestedProfilesModal, useUserStore, GetAllExplorePostsApi, useState, useEffect, HomeSkeleton, useRouter, GetCategories } from '@/app/ui/imports'

export default function Explore() {
    const user = useUserStore((state) => state.user);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [postError, setPostError] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState('all')
    const [categoryList, setCategoryList] = useState([])
    const [reRenderSuggestedProfile, setReRenderSuggestedProfile] = useState(0)

    const [localIsFollowing, setLocalIsFollowing] = useState(null) //tracks when a user is followed in the ArticleCard child component



    //get categories lookup
    const fetchCategories = async () => {
        try {
            const { response, jsonResponse, error } = await GetCategories()
            if (error) {
                toast.error(error)
                return
            }

            if (response.ok && jsonResponse?.status) {
                setCategoryList(jsonResponse?.data)
                return
            }
        } catch (error) {
            toast.error(error.message)
            return
        }
    }

    // Fetch all posts from explore
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const { response, jsonResponse, error } = await GetAllExplorePostsApi(selectedCategory);
            if (error) {
                setPostError(error);
                setLoading(false);
                return;
            }

            if (response.ok) {
                console.log(jsonResponse)
                setPosts(jsonResponse)
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

    useEffect(() => {
        fetchCategories();
        fetchPosts();
    }, []);

    useEffect(() => {
        // Fetch posts whenever the selected category changes
        fetchPosts();
    }, [selectedCategory]);

    return (
        <div>
            <div className='flex-1'>
                <h2 className="text-lg font-medium mb-2">{`Good morning ${user?.user?.name}! `}<span className="ml-1">👋</span></h2>
                <p className="text-gray-500 mb-4">Here are today’s most interesting articles to <span className='font-semibold'>explore</span></p>
                <div className="flex gap-2 pt-4 lg:pt-0 mb-6 flex-wrap">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-1.5 rounded-full cursor-pointer hover:bg-primary hover:text-white border text-sm ${'all' === selectedCategory ? 'bg-primary text-white' : 'bg-white border-gray-300 text-gray-600'}`}
                    >
                        {'All'}
                    </button>
                    {categoryList?.map((category) => (
                        <button
                            onClick={() => setSelectedCategory(category?.id)}
                            key={category?.id}
                            className={`px-4 py-1.5 rounded-full cursor-pointer hover:bg-primary hover:text-white border text-sm ${category?.id === selectedCategory ? 'bg-primary text-white' : 'bg-white border-gray-300 text-gray-600'}`}
                        >
                            {category?.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row w-full items-start gap-8">
                {loading ?

                    < HomeSkeleton />
                    :
                    posts?.posts?.length > 0 ?
                        <main className="flex-1">


                            <div className="space-y-4">
                                {posts?.posts.map((article, index) => (
                                    <ArticleCard setReRenderSuggestedProfile={setReRenderSuggestedProfile} key={index} article={article} setLocalIsFollowing={setLocalIsFollowing} localIsFollowing={localIsFollowing}/>
                                ))}
                            </div>

                            {/* <div className="mt-6 flex justify-center">
                                <button className="bg-gray-100 px-4 py-2 rounded-md text-sm hover:bg-gray-200">
                                    Load more articles
                                </button>
                            </div> */}
                        </main>
                        :
                        postError == null ?
                            <p className="text-center  w-full text-[#757575] pt-9">No more Posts for now...</p>

                            :
                            null
                }

                {postError && (
                    <p className="text-center w-full text-red-500 text-sm">{postError}</p>
                )}


                {/* profiles suggested for you */}
                <SuggestedProfilesModal reRender={reRenderSuggestedProfile}/>
            </div>
        </div>
    );
}
