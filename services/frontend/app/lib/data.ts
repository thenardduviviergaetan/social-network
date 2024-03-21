import axios, { AxiosResponse } from 'axios';
import { User } from './definitions';
import { auth } from '@/auth';
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 5; // Number of posts per page
const GROUPS_PER_PAGE = 10 // Number of groups per page

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

// TODO  Rename this func to better reflect that usage is limited to POSTS.
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

/////////////////>- GROUPS -</////////////////

// TODO this function could be used to shorten every function in this page.
async function fetchGlobal(url: string, err: string) {
    try {
        const res = await axios.get(`http://caddy:8000/api${url}`)
        return res.data
    } catch (error) {
        console.log(err);
        console.log(error);
        return null
    }
}

export const fetchTotalGroupPages = async () => {
    return fetchGlobal(
        `/groups?totalPages=true`,
        'Error fetching total group pages'
    )
}

export const fetchGroups = async (pageNumber: number) => {
    const session = await auth()

    return fetchGlobal(
        `/groups?page=${pageNumber}&&limit=${GROUPS_PER_PAGE}&&user=${session?.user?.id}`,
        'Error fetching groups')
}


export const fetchGroup = async (groupeID: string) => {
    return fetchGlobal(
        `/group?id=${groupeID}`,
        `Error fetching group with ID ${groupeID}`
    )
}
