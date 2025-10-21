import {
    Share2,
    MessageCircle,
    Bookmark,
} from "lucide-react"
import { Button } from "@/app/ui/imports"


export const UserQuickAction = () => {
    return (
        <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
            <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start rounded-xl bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl bg-transparent">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Bookmark Profile
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl bg-transparent">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Profile
                </Button>
            </div>
        </div>
    )
}