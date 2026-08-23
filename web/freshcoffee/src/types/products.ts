export interface CMSProduct {
    id: number;

    title: string;

    image?: string;

    category?: string;

    category_url?: string;

    table?: string;

    price?: string | number;

    variable_price?: boolean;

    variants?: {
        size: string;
        price: number;
    }[];
} 