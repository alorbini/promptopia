import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// This will be read from your .env file
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
});

// --- Types ---
export interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string;
}

export interface Prompt {
    id: string;
    model: string;
    difficulty: string;
    cover_image_url: string | null;
    category: {
        id: string;
        slug: string;
    };
    translation: {
        lang: 'ar' | 'en';
        title: string;
        subtitle: string;
    };
}

export interface PromptDetail extends Prompt {
    translation: {
        lang: 'ar' | 'en';
        title: string;
        subtitle: string;
        prompt_text: string;
    };
    tags: { id: string; name: string; lang: 'ar' | 'en' | null }[];
}

export interface PaginatedResponse<T> {
    data: T[];
    links: { first: string; last: string; prev: string | null; next: string | null };
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

// --- API Functions ---
export const fetchCategories = async (lang: 'ar' | 'en'): Promise<Category[]> => {
    // We will not cache categories anymore as they need to be language-specific
    const { data } = await apiClient.get<PaginatedResponse<Category>>('/categories', {
        params: { per_page: 50, lang: lang },
    });
    return data.data;
};

interface FetchPromptsParams {
    categoryId: string;
    lang: 'ar' | 'en';
    page?: number;
}

export const fetchPrompts = async ({ categoryId, lang, page = 1 }: FetchPromptsParams): Promise<PaginatedResponse<Prompt>> => {
    const { data } = await apiClient.get<PaginatedResponse<Prompt>>('/prompts', {
        params: {
            category_id: categoryId,
            lang,
            page,
            per_page: 10,
        },
    });
    return data;
};

export const fetchPromptDetail = async (id: string, lang: 'ar' | 'en'): Promise<PromptDetail> => {
    const { data } = await apiClient.get<{ data: PromptDetail }>(`/prompts/${id}`, { params: { lang } });
    return data.data;
};
