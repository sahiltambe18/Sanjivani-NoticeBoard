export interface typeNotice{
    id: number | string;
    title?: string;
    points: string[];
    imageUrl?: string;
    createdAt? : Date
}

export interface Admin {
    email: string;
    id: string;
}