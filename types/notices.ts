export interface typeNotice{
    id: number | string;
    title?: string;
    points: string[];
    imageUrl?: string;
    videoUrl?: string;
    createdAt? : Date
    department?: string
}

export interface Admin {
    email: string;
    id: string;
}