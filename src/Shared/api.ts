
import axios from 'axios';
import { useAuthStore } from '../features/auth/useAuthStore';


export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 50000,
    withCredentials: true,
});




export const setupAxiosInterceptors = (getToken: () => string | null) => {




 
}

  // add a JWT auth token if you have one
  api.interceptors.request.use(config => {
      const token = useAuthStore.getState().token;
      if (token) config.headers!['Authorization'] = token;
      console.log('Request headers being sent:', config.headers);
      return config;
  });


 // Add response interceptor to see errors
  api.interceptors.response.use(
      (response) => response,
      (error) => {
          console.error('API Error:', error);
          if (error.response) {
              console.error('Response status:', error.response.status);
              console.error('Response headers:', error.response.headers);
          }
          return Promise.reject(error);
      }
  );


export interface GenericResponse<T> {
    data:T;
    message:string;
    server_message:string;
}

const CLOUD_NAME = import.meta.env.VITE_API_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_API_UPLOAD_PRESET as string; // unsigned preset

export const uploadImageDirect = async (
  file: File,
  folder:string,
  onProgress?: (percent: number) => void
): Promise<string> => {

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder',folder);
    try {
    const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
            }
        },
        }
    );

    return response.data.secure_url;
    } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw new Error('Image upload failed');
    }
};


export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public_id from the Cloudinary URL
    const urlParts = imageUrl.split('/');
    const filenameWithExtension = urlParts[urlParts.length - 1];
    const public_id = filenameWithExtension.split('.')[0];

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
      {
        public_id,
        upload_preset: UPLOAD_PRESET
      }
    );

    if (response.data.result !== 'ok') {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Cloudinary delete failed:', error);
    throw new Error('Image deletion failed');
  }
};

