import { useEffect, useState } from "react"
import ArticleCard from "../homepage/article-card"
import { GetCategories } from "@/app/api/api"
import HomeSkeleton from "../homepage/home-skeleton"

export default function SearchResult({ searchTerm, setSearchTerm, searchResults, setSearchResults, searchLoading }) {
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

    //handle clear search
    const handleClearSearch = () => {
        setSearchTerm('')
        setSearchResults([])
    }

    useEffect(() => {
        fetchCategories();
    }, []);


    return (
        <div>
            <div className='flex-1'>
                {/* <h2 className="text-lg font-medium mb-2">{`Good morning ${user?.user?.name}! `}<span className="ml-1">👋</span></h2> */}
                <div className="flex mb-4 justify-between items-center text-gray-500">
                    <p className="">Your Search results.</p>
                    <p onClick={handleClearSearch} className="text-2xl cursor-pointer" tooltip="Clear search" >X</p>
                </div>
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

            {console.log("another search results: ", searchResults)}

            <div className="flex flex-col lg:flex-row w-full items-start gap-8">
                {searchLoading ?
                    < HomeSkeleton />
                    :
                    searchResults?.posts?.length > 0 ?
                        <main className="flex-1">


                            <div className="space-y-4">
                                {searchResults?.posts.map((article, index) => (
                                    <ArticleCard setReRenderSuggestedProfile={setReRenderSuggestedProfile} key={index} article={article} setLocalIsFollowing={setLocalIsFollowing} localIsFollowing={localIsFollowing} />
                                ))}
                            </div>

                        </main>
                        :

                        <p className="text-center  w-full text-[#757575] pt-9">No Posts found for your search.</p>
                }

                {/* profiles suggested for you */}
                {/* <SuggestedProfilesModal reRender={reRenderSuggestedProfile} /> */}
            </div>
        </div>
    )
}