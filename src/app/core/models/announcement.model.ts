export interface Announcement {
    id?: number;
    title: string;
    description: string;
    price: number;
    categoryId: number;
    userId: number;
    imageUrl: string;
    categoryName?: string;
    sellerName?: string;
    sellerId?: number;
    sellerAvatar?: string;
}
