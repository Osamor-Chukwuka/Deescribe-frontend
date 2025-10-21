import Cookies from "js-cookie";
import { credentials } from "./credentials";

// AUTH API CALLS
// Login
export const LoginApi = async (email, password) => {
    const data = {
        email: email,
        password: password
    }

    try {
        const response = await fetch(`${credentials.baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
            },
            body: JSON.stringify(data)
        })

        const jsonResponse = await response.json()

        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}

// Signup
export const SignupApi = async (name, email, password) => {
    const data = {
        name: name,
        email: email,
        password: password
    }

    try {
        const response = await fetch(`${credentials.baseUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
            },
            body: JSON.stringify(data)
        })

        const jsonResponse = await response.json()

        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}


//forgot-password
export const ForgotPasswordApi = async (email) => {
    const data = {
        email
    }

    try {
        const response = await fetch(`${credentials.baseUrl}/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
            },
            body: JSON.stringify(data)
        })

        const jsonResponse = await response.json()

        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}

//reset-password
export const ResetPasswordApi = async (email, password, password_confirmation, token) => {
    const data = {
        email,
        password,
        password_confirmation,
        token
    }

    try {
        const response = await fetch(`${credentials.baseUrl}/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
            },
            body: JSON.stringify(data)
        })

        const jsonResponse = await response.json()

        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}

// POSTS
// Get all posts from explore
export const GetAllExplorePostsApi = async (selectedCategory, searchTerm = null) => {
    const token = Cookies.get('token')

    try {
        const response = await fetch(`${credentials.baseUrl}/posts?category=${selectedCategory}&searchterm=${searchTerm}`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })

        const jsonResponse = await response.json()

        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}

// Get all posts from user feed
export const GetFeedPostsApi = async (selectedCategory) => {
    const token = Cookies.get('token')

    try {
        const response = await fetch(`${credentials.baseUrl}/feed?category=${selectedCategory}`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })

        const jsonResponse = await response.json()

        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}

// get specific post
export const GetPostApi = async (id) => {
    const token = Cookies.get('token')

    try {
        const response = await fetch(`${credentials.baseUrl}/posts/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })

        const jsonResponse = await response.json()

        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}

// get user posts
export const GetUserPostsApi = async (id, sort = null) => {
    const token = Cookies.get('token')

    try {
        const response = await fetch(`${credentials.baseUrl}/user/posts/${id}?sort=${sort}`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })

        const jsonResponse = await response.json()

        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}

// create post
export const CreatePostApi = async (data) => {
    const token = Cookies.get('token')

    try {
        const response = await fetch(`${credentials.baseUrl}/post`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })


        console.log("response: ", response)

        const jsonResponse = await response.json()

        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}



// LIKES
// Like a post
export const LikePostApi = async (postId) => {
    const token = Cookies.get('token')
    console.log(token)

    try {
        const response = await fetch(`${credentials.baseUrl}/like/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })

        const jsonResponse = await response.json()

        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}

// Unlike a post
export const UnlikePostApi = async (postId) => {
    const token = Cookies.get('token')
    console.log(token)

    try {
        const response = await fetch(`${credentials.baseUrl}/like/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })

        const jsonResponse = await response.json()

        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}



// COMMENTS
// get comments
export const GetComments = async (id) => {
    const token = Cookies.get('token')

    try {
        const response = await fetch(`${credentials.baseUrl}/posts/${id}/comments`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })

        const jsonResponse = await response.json()

        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}


// create comment
export const CreateComments = async (id, content) => {
    const token = Cookies.get('token')
    const data = {
        content: content
    }

    try {
        const response = await fetch(`${credentials.baseUrl}/posts/${id}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })

        const jsonResponse = await response.json()

        console.log(jsonResponse)


        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}


// create bookmark
export const CreateBookmark = async (postId) => {
    const token = Cookies.get('token')

    try {
        const response = await fetch(`${credentials.baseUrl}/bookmark/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            },
        })

        const jsonResponse = await response.json()

        console.log(jsonResponse)


        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}


// delete bookmark
export const DeleteBookmark = async (postId) => {
    const token = Cookies.get('token')

    try {
        const response = await fetch(`${credentials.baseUrl}/bookmark/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            },
        })

        const jsonResponse = await response.json()

        console.log(jsonResponse)


        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}




// CLOUDINARY
// upload post images
export const UploadPostImages = async (formData) => {

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${credentials.CloudName}/upload`, {
            method: 'POST',
            body: formData
        })

        const jsonResponse = await response.json();
        // const imageUrl = jsonResponse.secure_url;


        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}




//LOOKUPS
// get categories
export const GetCategories = async () => {
    const token = Cookies.get('token')
    try {
        const response = await fetch(`${credentials.baseUrl}/lookups/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })

        const jsonResponse = await response.json()
        console.log('categories: ', jsonResponse)
        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}



//FOLLOW AND FOLLOWING
// get users i am not following 
export const GetUsersIamNotFollowing = async () => {
    const token = Cookies.get('token')
    try {
        const response = await fetch(`${credentials.baseUrl}/users/not-following`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })

        const jsonResponse = await response.json()
        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}

//follow a user
export const FollowUser = async (userId) => {
    const token = Cookies.get('token')
    try {
        const response = await fetch(`${credentials.baseUrl}/follow/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })

        const jsonResponse = await response.json()
        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}


//unfollow a user
export const UnFollowUser = async (userId) => {
    const token = Cookies.get('token')
    try {
        const response = await fetch(`${credentials.baseUrl}/follow/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })

        const jsonResponse = await response.json()
        console.log("unfollow user: ", jsonResponse)
        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}



//USER
//get user profile
export const GetUserProfile = async (id) => {
    const token = Cookies.get('token')
    try {
        const response = await fetch(`${credentials.baseUrl}/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })

        const jsonResponse = await response.json()
        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}

//update user profile
export const UpdateUser = async (payload) => {
    const token = Cookies.get('token')
    try {
        const response = await fetch(`${credentials.baseUrl}/user/update`, {
            method: 'put',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        const jsonResponse = await response.json()
        return { response, jsonResponse }

    } catch (error) {
        return { error: error.message }
    }
}