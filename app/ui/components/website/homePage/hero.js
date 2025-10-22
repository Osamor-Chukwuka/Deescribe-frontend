import { Button, ArrowRight, useRouter } from '@/app/ui/imports';

export default function HeroSection() {
    const router = useRouter()

    return (
        <section className="text-center mt-20 max-w-3xl mx-auto">
            <div className='w-full lg:text-6xl sm:text-5xl font-extrabold text-gray-900'>
                <h2 className=" ">
                    Where great stories
                </h2>
                <p className="text-primary pt-1">come to life</p>
            </div>

            <p className="mt-5 text-lg text-gray-600">
                Join millions of writers and readers on Deescribe. Share your ideas,
                discover new perspectives, and connect with a community that values
                quality content.
            </p>
            <div className="mt-10 flex flex-col px-2 lg:px-0 sm:flex-row justify-center gap-4">
                <Button onclick={()=>router.push('/login')}>
                    Start Writing <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button onclick={()=>router.push('/login')} variant="outline">
                    Explore Stories
                </Button>
            </div>
        </section>
    )
}