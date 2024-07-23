'use server'

import { File } from "buffer";
import { cloudinary } from "./cloudinary";

export interface UploadResponse {
    url?: string;
    error?: string;
}

export const handleUpload = async (data: FormData , type: string = "image"): Promise<UploadResponse> => {
    const file = data.get(type) as unknown as File;
    if (!file) {
        return { error: "No file uploaded" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
        const res = await new Promise<{ secure_url: string }>((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                resource_type: type=="video" ? "video": "image"
            }, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                if (!result) {
                    reject(new Error("No result from Cloudinary"));
                    return;
                }
                resolve(result);
            }).end(buffer);
        });

        return { url: res.secure_url };
    } catch (error) {
        console.error("Upload failed", error);
        return { error: "Upload failed" };
    }
};
