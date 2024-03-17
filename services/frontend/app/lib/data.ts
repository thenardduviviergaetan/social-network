import axios, { AxiosResponse } from 'axios';
import { User } from './definitions';
import { auth } from '@/auth';
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 5; // Number of posts per page

export const fetchUser = async () => {
    const session = await auth()
    try {
        const res = await axios.get(`http://caddy:8000/api/user?email=${session?.user?.email}`);
        return res.data as User;
    } catch (error) {
        console.error('Error fetching user data');
        return null;
    }
}

export const fetchPageNumber = async () => {
    noStore()
    try {
        const res = await axios.get('http://caddy:8000/api/posts/page-number');
        const totalPages = Math.ceil(res.data / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Error fetching page number');
        return null;
    }
}

export const fetchPosts = async (pageNumber: number) => {
    try {
        const res = await axios.get(`http://caddy:8000/api/posts?page=${pageNumber}&&limit=${ITEMS_PER_PAGE}`);
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
        console.error('Error fetching post iiii');
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