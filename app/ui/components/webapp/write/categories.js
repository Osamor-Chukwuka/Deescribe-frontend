import { GetCategories } from "@/app/api/api"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export const PostCategories = ({ selectedCategories, setSelectedCategories }) => {

    const [category, setCategory] = useState('')
    const [categoryList, setCategoryList] = useState([])

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

    const addCategory = e => {
        e.preventDefault()
        const c = e.target.value.trim()
        if (c && !selectedCategories.includes(c)) setSelectedCategories([...selectedCategories, c])
        setCategory(c)
    }

    const removeCategory = c => setSelectedCategories(selectedCategories.filter(cat => cat !== c))

    useEffect(() => {
        fetchCategories()
    }, [])

    return (
        <div>
            <label>Select Categories</label>
            <select className="w-full border outline-none cursor-pointer rounded-lg p-2" value={category} onChange={e => addCategory(e)}>
                <option value={''}>select category(s)</option>
                {categoryList?.map((c, index) => (
                    <option key={index} value={c.id} >{c?.name}</option>
                ))}
            </select>

            <div className="flex flex-wrap gap-2 mt-2">
                {selectedCategories.map(c => (
                    categoryList.map(l => (
                        l.id == c && (
                            <span key={c} className="px-3 py-1 bg-gray-200 rounded-full flex items-center">
                                {l.name}
                                <X onClick={() => removeCategory(c)} className="ml-1 w-4 h-4 cursor-pointer" />
                            </span>
                        )
                    ))
                ))}
            </div>
        </div>
    )
}