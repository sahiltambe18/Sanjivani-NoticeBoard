import { v2 } from 'cloudinary';


 v2.config({
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
    cloud_name:process.env.CLOUD_NAME
});

export {v2 as cloudinary}