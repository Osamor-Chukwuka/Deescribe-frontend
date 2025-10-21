import { X } from "lucide-react"
import { Plus } from "lucide-react"
import { useState } from "react"

export const WriteSettings = () => {
    const [tags, setTags] = useState([])
    const [newTag, setNewTag] = useState('')
    const [category, setCategory] = useState('Technology')
    const [isPublic, setIsPublic] = useState(true)

    const addTag = e => {
        e.preventDefault()
        const t = newTag.trim()
        if (t && !tags.includes(t)) setTags([...tags, t])
        setNewTag('')
    }

    const removeTag = t => setTags(tags.filter(tag => tag !== t))

    return (
        <div className="space-y-4">
            <div>
                <label>Category</label>
                <select className="w-full border p-2" value={category} onChange={e => setCategory(e.target.value)}>
                    {cats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="flex items-center space-x-2">
                <input type="checkbox" checked={isPublic}
                    onChange={e => setIsPublic(e.target.checked)} />
                <label>Public</label>
            </div>
            <div>
                <label>Add Tag</label>
                <form onSubmit={addTag} className="flex space-x-2">
                    <input className="flex-1 border p-2" value={newTag}
                        onChange={e => setNewTag(e.target.value)} placeholder="Tag" />
                    <button type="submit" className="p-2 bg-teal-600 text-white rounded">
                        <Plus className="w-5 h-5" />
                    </button>
                </form>
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(t => (
                        <span key={t} className="px-3 py-1 bg-gray-200 rounded-full flex items-center">
                            {t}
                            <X onClick={() => removeTag(t)} className="ml-1 w-4 h-4 cursor-pointer" />
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}