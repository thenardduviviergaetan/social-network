import axios, { AxiosResponse } from 'axios';
import { User } from './definitions';
import { auth } from '@/auth';

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

export const fetchPosts = async () => {
    try {
        const res = await axios.get('http://caddy:8000/api/posts');
        return res.data;
    } catch (error) {
        console.error('Error fetching posts');
        return null;
    }
}