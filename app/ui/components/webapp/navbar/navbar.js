'use client'
import { FiSearch, BiUserCircle, Menu, X, useState, Link, usePathname, useUserStore, useRouter, FaRegUser, IoSettingsOutline, FiLogOut, Image, Cookies, GetAllExplorePostsApi, FaBookmark, Bookmark } from '@/app/ui/imports'
import { WordsIndexes } from '@/app/utils/words-indexes';
import toast from 'react-hot-toast';

export default function AppNavbar({ searchTerm, setSearchTerm, setSearchLoading, setSearchResults }) {
    // global states
    const clearUser = useUserStore((state) => state.clearUser);
    const user = useUserStore((state) => state.user);
    // local states
    const [menuOpen, setMenuOpen] = useState(false);
    const [userIconOpen, setUserIconOpen] = useState(false);

    const sidebarItems = [{ name: 'Explore', link: '/' }, { name: 'My Feed', link: '/feed' }]
    const userIconItems = [{ name: 'Profile', link: `/profile/${user?.user?.id}`, icon: <FaRegUser /> }, { name: 'Bookmarks', link: '/bookmarks', icon: <Bookmark className='text-sm w-5 pb-2 pe-1' /> }, { name: 'Settings', link: '/settings', icon: <IoSettingsOutline /> }]

    // path variable
    const pathname = usePathname();
    // router
    const router = useRouter();

    // handle change menu
    const handleChangeMenu = (e, link) => {
        e.preventDefault();
        router.push(link)
    }

    //handle search
    const handleSearch = async (item) => {
        //remove the existing search results when the user has cleared the search input box
        if (item.length < 1) {
            setSearchTerm(item)
            setSearchResults([])
            return
        }

        setSearchLoading(true)
        setSearchTerm(item)
        try {
            const { response, jsonResponse, error } = await GetAllExplorePostsApi('all', item);
            if (error) {
                toast.error(error);
                setSearchLoading(false);
                return;
            }

            if (response.ok) {
                console.log("search result: ", jsonResponse)
                setSearchResults(jsonResponse)
                setSearchLoading(false);
            } else {
                toast.error(jsonResponse.message)
                setSearchLoading(false)
                return
            }
        } catch (error) {
            toast.error(error.message)
            setSearchLoading(false)
            return
        }
    }

    // handle logout
    const handleLogout = (e) => {
        e.preventDefault();
        router.push('/login')
        Cookies.remove('token');
        clearUser()
    }

    return (
        <div className="border-b border-gray-300 lg:mb-6 mb-9">
            <div className="flex justify-between items-center lg:mb-0 mb-3 px-4 md:px-12 pb-3 lg:pb-0">
                <h1 className="text-2xl text-start lg:-mx-12 font-semibold w-full ">{process.env.NEXT_PUBLIC_APP_NAME}</h1>



                <div className=' w-full hidden md:block '>
                    <ul className='text-md tracking-[0.01em] flex items-center justify-center cursor-pointer'>
                        {sidebarItems.map((item, index) => (
                            <li onClick={(e) => handleChangeMenu(e, item.link)} key={index} className={`${pathname === item.link ? 'text-primary-hover' : ''} py-5 hover:text-primary-hover px-7 `}><Link href={item.link}>{item.name}</Link></li>
                        ))}
                    </ul>
                </div>

                {/* Desktop: search, write, user */}
                <div className="hidden md:flex items-center gap-4 w-full ">

                    {/* Search */}
                    <div className="relative">
                        <input
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none"
                        />
                        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                    </div>

                    {/* Write button */}
                    <button onClick={()=>router.push('/write')} className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-full w-full cursor-pointer">
                        + Write
                    </button>

                    <div className='flex items-center w-full justify-end'>
                        {/* User icon */}
                        <div className="relative">
                            {console.log("header user: ", user)}
                            <div className='flex items-center w-full'>
                                <div className=''>
                                    <Image
                                        width={100}
                                        height={100}
                                        src={user?.user?.profile_image}
                                        alt={'user profile'}
                                        className="w-10 h-10 rounded-full cursor-pointer"
                                        onClick={() => setUserIconOpen(!userIconOpen)}
                                    />
                                </div>

                                {/* <div className='w-full'>
                                    <p className='ps-1 font-semibold text-xl'>{WordsIndexes(user?.user?.name)}</p>
                                </div> */}
                            </div>
                            {userIconOpen && (
                                <div className="origin-top-right absolute right-0 left-[-170%] mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                                    {userIconItems.map((item, index) => (
                                        <Link key={index} href={item.link} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <span className="mr-2 w-4 h-4">{item.icon}</span>
                                            <span>{item.name}</span>
                                        </Link>
                                    ))}
                                    <button
                                        onClick={(e) => { handleLogout(e) }}
                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                                    >
                                        <FiLogOut className="mr-2 w-4 h-4" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* user name */}
                        {/* <p className='ps-1 font-semibold rounded-full bg-gray-400 p-1'>{user.user.name.split(" ").map(word => word[0]).join("").toUpperCase()}</p> */}
                    </div>
                </div>

                {/* Mobile: menu toggle */}
                <button
                    className="md:hidden text-gray-600 hover:text-gray-800"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

            </div>

            {/* Mobile menu panel */}
            {menuOpen && (
                <div className="md:hidden px-4 pb-4 flex flex-col gap-4">
                    {/* Search */}
                    <div className="relative">
                        <input
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none w-full"
                        />
                        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                    </div>

                    {/* Write button */}
                    <button onClick={()=>router.push('/write')} className="bg-primary cursor-pointer hover:bg-primary-hover text-white px-4 py-2 rounded-full">
                        + Write
                    </button>

                    {/* mobile sidebar items */}
                    <div className=' w-full md:hidden '>
                        <ul className='text-lg tracking-[0.01em] flex flex-col items-center justify-center cursor-pointer'>
                            {sidebarItems.map((item, index) => (
                                <li onClick={(e) => handleChangeMenu(e, item.link)} key={index} className={`${pathname === item.link ? 'text-primary-hover' : ''} py-3 hover:text-primary-hover px-7 `}><Link href={item.link}>{item.name}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* User icon */}
                    <div className="flex justify-center">
                        <div className="w-full">
                            <BiUserCircle
                                className="text-4xl w-full text-center text-gray-600 cursor-pointer"
                                onClick={() => setUserIconOpen(!userIconOpen)}
                            />
                            {userIconOpen && (
                                <div className=" mt-2 w-100 mb-3 -mx-10 bg-white border border-gray-50 rounded-md shadow-sm py-1 z-50">
                                    {userIconItems.map((item, index) => (
                                        <Link key={index} href={item.link} className="flex items-center justify-center px-4 py-2 text text-gray-700 hover:bg-gray-100">
                                            <span className="mr-2 w-4 h-4">{item.icon}</span>
                                            <span>{item.name}</span>
                                        </Link>
                                    ))}
                                    <button
                                        onClick={(e) => { handleLogout(e) }}
                                        className="w-full flex justify-center items-center px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100"
                                    >
                                        <FiLogOut className="mr-2 w-4 h-4" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
