import { ArrowRight, Button, useRouter } from "@/app/ui/imports";

export default function CallToAction() {
    const router = useRouter()
    return (
        <div>
            <section className="text-center pb-[10%] ">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    Ready to start your writing journey?
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                    Join thousands of writers who have already discovered the power of Deescribe.
                </p>
                <div className="mt-8">
                    <Button onclick={()=>router.push('/login')}>
                        Get Started for Free <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </section>
        </div>
    )
}