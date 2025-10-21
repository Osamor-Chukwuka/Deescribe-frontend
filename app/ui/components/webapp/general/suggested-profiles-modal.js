'use client'
import { FollowUser, GetUsersIamNotFollowing, Image, Link, SuggestedForYouSkeleton, useEffect, useState } from '@/app/ui/imports'
import toast from 'react-hot-toast'

export default function SuggestedProfilesModal({reRender}) {
    const [suggestions, setSugestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedProfile, setSelectedProfile] = useState(null)


    // get suggessted profiles
    const fetchSuggestedUsers = async () => {
        setLoading(true)

        try {
            const { response, jsonResponse, error } = await GetUsersIamNotFollowing()

            if (error) {
                toast.error(error)
                setError(error)
                return
            }

            if (response.ok && jsonResponse?.status) {
                setSugestions(jsonResponse.data)
                return
            } else {
                toast.error(jsonResponse.message || 'Could not fetch suggested profiles')
                setError(jsonResponse.message || 'Could not fetch suggested profiles')
                return
            }

        } catch (error) {
            toast.error(error.message || 'An error occurred while fetching suggested profiles')
            setError(error.message || 'An error occurred while fetching suggested profiles')
            return

        } finally {
            setLoading(false)
            return
        }
    }

    //follow a user
    const handleFollowUser = async (userId) => {
        setSelectedProfile(userId)

        try {
            const { response, jsonResponse, error } = await FollowUser(userId)

            if(error){
                toast.error(error)
                setSelectedProfile(null)
                return
            }

            if(response.ok && jsonResponse?.status) {
                setTimeout(() => {
                    fetchSuggestedUsers()
                }, 1000);
            }else if(!response.ok || !jsonResponse?.status) {
                toast.error(jsonResponse?.message || 'Could not follow user')
                setSelectedProfile(null)
                return
            }

        } catch (error) {
            toast.error(error.message || 'An error occurred while following user')
            setSelectedProfile(null)
            return
        }
    }

    useEffect(() => {
        fetchSuggestedUsers()
    }, [])

    useEffect(()=>{
        fetchSuggestedUsers()
    }, [reRender])

    return (
        loading ? <SuggestedForYouSkeleton /> :
            <div>
                <aside className="w-full lg:w-80 bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-fit">
                    <h3 className="font-semibold text-gray-800 mb-4">Suggested Writers for you</h3>
                    <div className="space-y-4">
                        {suggestions?.length > 0 ?
                            suggestions.map((person, idx) => (
                                idx <= 4 ?
                                    <div key={idx} className="flex justify-between items-start">
                                        <div>
                                            <div className='flex items-center gap-4'>
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    src="https://images.unsplash.com/photo-1550592704-6c76defa9985?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHdyaXRpbmd8ZW58MHx8MHx8fDA%3D"
                                                    alt={person.name}
                                                    className="w-7 h-7 rounded-full"
                                                />
                                                <Link href={`/profile/${person.id}`} className="font-medium text-gray-800 hover:text-primary cursor-pointer">{person.name}</Link>
                                            </div>
                                            <div className='ps-10'>
                                                {/* <p className="text-sm text-gray-500 pb-1">{person.handle}</p> */}
                                                <p className="text-sm text-gray-500 mt-1 leading-snug">{person.bio}</p>
                                                <p className="text-xs font-semibold text-gray-500 mt-1">{person.followers_count} follower(s)</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleFollowUser(person?.id)} className="text-sm border px-3 py-1 rounded-full text-primary border-primary cursor-pointer hover:bg-primary-hover hover:text-white">{selectedProfile === person?.id ? 'Following' : 'Follow'}</button>
                                    </div>
                                    : ''
                            ))
                            :
                            !error && (
                                <p className="text-gray-500">No suggestions available at the moment.</p>
                            )
                        }

                        {error && (
                            <p className="text-red-300">Error: {error}</p>
                        )}
                    </div>
                    <div className="mt-4">
                        <button className="text-primary text-sm hover:underline cursor-pointer">
                            See more suggestions
                        </button>
                    </div>
                </aside>
            </div>
    )
}