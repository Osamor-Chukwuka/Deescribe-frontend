import { useUserStore } from "@/app/store/user-store";
import { IoCamera } from "react-icons/io5";
import { use, useRef, useState } from "react";
import { UpdateUser, UploadPostImages } from "@/app/api/api";
import { ProfileImageSkeleton } from "../general/profile-image-skeleton";
import toast from "react-hot-toast";
import { CoverImageSkeleton } from "../general/cover-image-skeleton";

export const ProfileImages = ({ userProfile }) => {
    const fileInputRef = useRef(null)
    const currentUser = useUserStore((state) => state.user);
    const isProfileOwner = currentUser?.user?.id === userProfile?.user?.id

    const [imageToUpdate, setImageToUpdate] = useState(null)

    const [loading, setLoading] = useState(false)

    const [newProfileImage, setNewProfileImage] = useState(null)
    const [newCoverImage, setNewCoverImage] = useState(null)


    //handle camera icon click
    const handleClick = (source) => {
        setImageToUpdate(source)
        fileInputRef.current.click(); // Trigger hidden file input
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Selected file:", file);
            uploadImage(file)
        }
    };

    //upload image to cloudinary
    const uploadImage = async (file) => {
        setLoading(imageToUpdate)
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'deescribe');

            const { response, jsonResponse, error } = await UploadPostImages(formData);

            if (error) throw new Error(error)

            if (response.ok) {
                await handleUpdateUser(jsonResponse.secure_url);
            } else {
                throw new Error(jsonResponse.message)
            }
        } catch (err) {
            console.error('profile upload error', err);
            toast.error(err.message || 'Upload failed');
        } finally {
            setLoading(false)
        }
    }

    //handle update user
    const handleUpdateUser = async (url) => {
        try {
            let payload;

            if (imageToUpdate == 'cover_image') {
                payload = { 'cover_image': url }
            } else {
                payload = { 'profile_image': url }
            }

            const { response, jsonResponse, error } = await UpdateUser(payload);

            if (error) throw new Error(error)

            if (response.ok && jsonResponse?.status) {
                toast.success("Profile updated successfully")

                if (imageToUpdate == 'cover_image') {
                    setNewCoverImage(url)
                } else {
                    setNewProfileImage(url)
                }

                return
            } else {
                throw new Error(jsonResponse.message || "update failed")
            }
        } catch (error) {
            toast.error(error.message)
            return
        }
    }

    return (
        <div className="relative mb-8">
            {/* cover image */}
            {loading == 'cover_image' ?
                <CoverImageSkeleton />
                :
                <div className="h-64 bg-gradient-to-r from-teal-500 to-blue-600 rounded-3xl overflow-hidden shadow-xl">
                    <img
                        src={newCoverImage || userProfile?.user?.cover_image}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute right-0 top-0 ">
                        {isProfileOwner && (
                            <>
                                <div onClick={() => handleClick('cover_image')} className="absolute -top-2 -right-1 w-12 h-12 bg-teal-600 cursor-pointer rounded-full flex items-center justify-center border-2 border-white">
                                    <span className="text-white text-xl cursor-pointer"><IoCamera /></span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            }

            {/* Profile Info Overlay */}
            <div className="absolute -bottom-16 left-8">
                <div className="flex items-end space-x-6">
                    {/* profile image */}
                    {loading == 'profile_image' ?
                        <ProfileImageSkeleton />
                        :
                        <div className="relative">
                            <img
                                src={newProfileImage || userProfile?.user?.profile_image}
                                alt={userProfile?.user?.name}
                                className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl"
                            />
                            {isProfileOwner && (
                                <>
                                    <div onClick={() => handleClick('profile_image')} className="absolute -top-2 -right-1 w-8 h-8 bg-teal-600 cursor-pointer rounded-full flex items-center justify-center border-2 border-white">
                                        <span className="text-white text-sm cursor-pointer"><IoCamera /></span>
                                    </div>
                                    {/* Hidden file input */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </>
                            )}
                        </div>
                    }

                    <div className="pb-4">
                        <h1 className="text-3xl font-bold text-white mb-2">{userProfile?.user?.name}</h1>
                        <p className="text-gray-500">@{userProfile?.user?.name.split(' ')}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}