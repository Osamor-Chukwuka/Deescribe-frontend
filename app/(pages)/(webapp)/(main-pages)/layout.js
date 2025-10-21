'use client'
import SearchResult from '@/app/ui/components/webapp/search/search-result';
import { AppNavbar, useUserStore, useEffect, useRouter, useState } from '@/app/ui/imports'

export default function RootLayout({ children }) {
  // global states
  const user = useUserStore((state) => state.user);
  const hasHydrated = useUserStore((state) => state.hasHydrated);
  //local states
  const [searchTerm, setSearchTerm] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  // Router
  const router = useRouter();

  // check if user is logged in
  const isLoggedIn = () => {
    if (!hasHydrated) return;

    if (!user) {
      router.push('/login')
      return;
    }
  }

  useEffect(() => {
    isLoggedIn();
  }, [hasHydrated, user, router]);

  if (!hasHydrated || !user) return null; // show nothing until hydration is done

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-12">

      <AppNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setSearchLoading={setSearchLoading} setSearchResults={setSearchResults} />

      {
        (searchResults?.posts?.length > 0 || searchTerm != '') ?
          <SearchResult searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchResults={searchResults} setSearchResults={setSearchResults} searchLoading={searchLoading} />
          :
          children
      }

    </div>
  );
}
