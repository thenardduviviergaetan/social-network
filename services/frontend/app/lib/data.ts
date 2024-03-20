import axios, { AxiosResponse } from 'axios';
import { User } from './definitions';
import { auth } from '@/auth';
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 5; // Number of posts per page

export const fetchUser = async (uuid?:string) => {
    const session = await auth()
    try {
        const res = await axios.get(`http://caddy:8000/api/user?UUID=${uuid}&email=${session?.user?.email}`);
        return res.data as User;
    } catch (error) {
        console.error('Error fetching user data');
        return null;
    }
}


export const fetchPageNumber = async (urlSegment: string, param?: string) => {
    noStore()
    try {
        const res = await axios.get(`http://caddy:8000/api/${urlSegment}/page-number?${param}`);
        const totalPages = Math.ceil(res.data / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Error fetching page number');
        return null;
    }
}

export const fetchPosts = async (pageNumber: number, urlSegment: string, param?: string) => {
    try {
        const res = await axios.get(`http://caddy:8000/api/${urlSegment}?page=${pageNumber}&limit=${ITEMS_PER_PAGE}&${param}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching posts');
        return null;
    }
}

export const fetchPost = async (postID: string) => {
    try {
        const res = await axios.get(`http://caddy:8000/api/post?id=${postID}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching post');
        return null;
    }
}

export const fetchComments = async (postID: string) => {
    try {
        const res = await axios.get(`http://caddy:8000/api/comments?post_id=${postID}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching comments');
        return null;
    }
}
