'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    ArrowLeft,
    Bold,
    Italic,
    Underline,
    Link2,
    List,
    ListOrdered,
    Quote,
    Code,
    ImageIcon,
    Eye,
    Send,
    Settings,
    X,
    Plus,
    Type,
    Palette,
    Layout,
    FileText,
} from 'lucide-react'
import { Button, CreatePostApi, PostCategories, SlateContentRenderer, TextArea, UploadPostImages, useRouter, WriteSettings } from '@/app/ui/imports'
import toast from 'react-hot-toast'
import { Editor, Node } from 'slate'

export default function WritePage() {
    const [title, setTitle] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [content, setContent] = useState('')
    const [submitLoading, setSubmitLoading] = useState(false)
    const [tab, setTab] = useState('write')

    //images
    const [images, setImages] = useState([])
    const [imageUrls, setImageUrls] = useState([])
    //categories
    const [selectedCategories, setSelectedCategories] = useState([])

    const router = useRouter();


    const handleImageChange = e => {
        const files = Array.from(e.target.files)
        const previews = files.map(file => ({
            id: file.lastModified + '_' + file.name,
            file,
            src: URL.createObjectURL(file),
            alt: file.name,
        }))
        setImages(prev => [...prev, ...previews])
    }

    const uploadImages = async () => {
        setSubmitLoading(true);
        // first check if title and content are empty
        if (title.length < 1 || content.length < 1) {
            alert("yh not up to")
            if (title.length < 1 && content.length < 1) {
                toast.error('Title and Content cannot be empty');
            } else if (title.length < 1) {
                toast.error('Title cannot be empty');
            } else {
                toast.error('Content cannot be empty');
            }
            setSubmitLoading(false);

            return;
        }


        if (images.length === 0) return publish();
        setSubmitLoading(true);

        const tempUrls = [];

        try {
            // Upload each file one at a time (you can switch to Promise.all if you prefer concurrency)
            for (const img of images) {
                const formData = new FormData();
                formData.append('file', img.file);
                formData.append('upload_preset', 'deescribe');

                const { response, jsonResponse, error } = await UploadPostImages(formData);

                if (error) {
                    toast.error(error);
                    setSubmitLoading(false);
                    return;
                }
                if (response.ok) {
                    tempUrls.push(jsonResponse.secure_url);
                } else {
                    toast.error(jsonResponse.message);
                    setSubmitLoading(false);
                    return;
                }
            }

            setImageUrls(tempUrls);
            publish(tempUrls)
        } catch (err) {
            console.error('Unexpected upload error', err);
            toast.error(err.message || 'Upload failed');
            setSubmitLoading(false);
        }
    };

    const publish = async (images = null) => {
        const stringContent = JSON.stringify(content)
        console.log("submit categories: ", selectedCategories)
        const data = {
            title,
            subtitle,
            content: stringContent,
            images,
            categories: selectedCategories,
        }

        try {
            const { response, jsonResponse, error } = await CreatePostApi(data);
            // console.log("submit data: ", data) 
            console.log(jsonResponse)
            if (error) {
                console.log(error)
                toast.error(error);
                return;
            }
            if (response.ok) {
                toast.success(jsonResponse?.message || "Post created successfully")
                localStorage.removeItem('content'); // Clear post data
                router.push('/')
                return
            } else {
                toast.error(jsonResponse.message);
                setSubmitLoading(false);
                return;
            }
        } catch (error) {

        } finally {
            setSubmitLoading(false)
        }
    }

    useEffect(() => {
        if (!content) {
            setContent(JSON.parse(localStorage.getItem('content')) || '')
        }
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 lg:px-6">
            {/* header */}
            <div className="flex justify-between items-center mb-6">
                <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Dashboard
                </Link>
                <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className='bg-primary text-white hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed' onClick={uploadImages} disabled={submitLoading}>
                        {
                            !submitLoading ?
                                <> <Send className="w-4 h-4 mr-1" /> Publish</>
                                :
                                <><Send className="w-4 h-4 mr-1 animate-spin" /> publishing...</>
                        }
                    </Button>
                </div>
            </div>

            {/* tabs */}
            <div className='flex justify-center'>
                <div className="flex justify-center space-x-4 mb-6 bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-2xl p-1 shadow-lg">
                    {['write', 'preview'].map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${tab === t
                                ? "bg-teal-600 text-white shadow-lg"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* main */}
                <div className="lg:col-span-3 space-y-6">

                    {tab === 'write' && (
                        <div className="space-y-4">
                            <input
                                className="w-full text-3xl font-bold"
                                placeholder="Title..."
                                value={title} onChange={e => setTitle(e.target.value)}
                            />
                            <input
                                className="w-full text-xl text-gray-600"
                                placeholder="Subtitle..."
                                value={subtitle} onChange={e => setSubtitle(e.target.value)}
                            />

                            {/* images */}
                            <div>
                                <label className="inline-block mb-2">
                                    <Plus className="inline w-5 h-5 mr-1 text-teal-600" /> Add Images
                                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                                <div className="grid grid-cols-2 gap-4">

                                    {images.map(img => (
                                        <div key={img.id} className="relative">
                                            <img src={img.src} alt={img.alt} className="w-full h-32 object-cover rounded" />
                                            <X
                                                onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))}
                                                className="absolute top-2 right-2 w-5 h-5 text-red-500 cursor-pointer"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* text area */}
                            <div className="h-full border rounded-lg p-4 prose">
                                <TextArea content={content} setContent={setContent} />
                            </div>

                            <div>
                                <PostCategories
                                    selectedCategories={selectedCategories}
                                    setSelectedCategories={setSelectedCategories}
                                />
                            </div>

                        </div>
                    )}

                    {tab === 'preview' && (
                        <div className="prose prose-lg">
                            <h1 className='text-3xl font-bold pb-2'>{title || ''}</h1>
                            {subtitle && <p>{subtitle}</p>}
                            <div className='my-3 flex flex-wrap gap-2'>
                                {images.map((img, index) => (
                                    <div key={img.id}>
                                        <img key={img.id} src={img.src} alt={img.alt} className=" object-cover rounded" />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <SlateContentRenderer content={content} />
                            </div>
                        </div>
                    )}

                    {tab === 'settings' && (
                        <WriteSettings />
                    )}

                </div>

                {/* sidebar */}
                <div className="space-y-6">
                    <div className="border rounded p-4">
                        <div className="flex justify-between mb-2">
                            <span>Words</span>
                            {/* {console.log("content: ", content ? Editor.string({ children: content }, []) : 0)} */}
                            <span>{content ? Node.string({ children: content }).split(/\s+/).filter(Boolean).length : 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Images</span>
                            <span>{images.length}</span>
                        </div>
                    </div>
                    <div className="border rounded p-4">
                        <h3 className="font-semibold mb-2">Writing Tips</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Start with a strong headline</li>
                            <li>Keep paragraphs short</li>
                            <li>Use images wisely</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    )
}
