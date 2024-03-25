import axios, { AxiosResponse } from 'axios';
import { User } from './definitions';
import { auth } from '@/auth';
import { unstable_noStore as noStore } from 'next/cache';

const ITEMS_PER_PAGE = 5; // Number of posts per page
const GROUPS_PER_PAGE = 10 // Number of groups per page

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

export const fetchFollowers = async (uuid?:string)=> {
    const session = await auth()
    try {
        const res = await axios.get(`http://caddy:8000/api/user/followers?user=${uuid ? uuid : session?.user?.uuid}`);
        return res.data
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

export const fetchGroups = async (
    created: boolean, member: boolean,pageNumber: number) => {

    const user = await fetchUser()
    const options = `created=${created}&&member=${member}`

    return fetchGlobal(
        `/groups?${options}&&page=${pageNumber}
        &&limit=${GROUPS_PER_PAGE}&&user=${user?.uuid}`,
        'Error fetching groups')
}


export const fetchGroup = async (groupeID: string) => {
    const user = await fetchUser()
    
    //TODO change so the user ID doesn't appear as an argument in the URL.
    return fetchGlobal(
        `/group?id=${groupeID}&&userID=${user?.uuid}`,
        `Error fetching group with ID ${groupeID}`
    )
}