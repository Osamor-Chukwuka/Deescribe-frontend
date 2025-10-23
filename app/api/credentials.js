const localIp = 'https://blog.test/api';
const productionIp = 'https://deescribebackend-production.up.railway.app/api';

const CloudinaryApiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
const CloudinaryApiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_SECRET_KEY

// const stagingIp = 'http://127.0.0.1:8000/api';
// const apiVersion = '/v1'

export const credentials = {
    baseUrl: localIp,
    CloudinaryApiKey: CloudinaryApiKey,
    CloudinaryApiSecret: CloudinaryApiSecret,
    CloudName: 'drmjq7src',
    uploadPreset: 'deescribe',
    // uploadFolder: 'deescribe/posts'
    // Authorization: 'Bearer ' + JSON.parse(localStorage.getItem(('user')))?.token || '',
} 