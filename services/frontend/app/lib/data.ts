import axios, { AxiosResponse } from "axios";
import { User } from "./definitions";
import { auth } from "@/auth";
import { unstable_noStore as noStore } from "next/cache";
import { API_BASE_URL, CADDY_URL, ITEMS_PER_PAGE } from "./constants";


export const fetchUser = async (uuid?: string) => {
  const session = await auth();
  try {
    const res = await axios.get(
      `${CADDY_URL}/user?UUID=${uuid}&email=${session?.user?.email}`,
    );
    return res.data as User;
  } catch (error) {
    console.error("Error fetching user data");
    return null;
  }
};

export const fetchFollowers = async (uuid?: string) => {
  const session = await auth();
  try {
    const res = await axios.get(
      `${CADDY_URL}/user/followers?user=${
        uuid ? uuid : session?.user?.uuid
      }`,
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching user data");
    return null;
  }
};

export const fetchPageNumber = async (urlSegment: string, param?: string) => {
  noStore();
  try {
    const res = await axios.get(
      `${CADDY_URL}/${urlSegment}/page-number?${param}`,
    );
    const totalPages = Math.ceil(res.data / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Error fetching page number");
    return null;
  }
};

export const fetchPosts = async (
  pageNumber: number,
  urlSegment: string,
  param?: string,
) => {
  try {
    const res = await axios.get(
      `${CADDY_URL}/${urlSegment}?page=${pageNumber}&limit=${ITEMS_PER_PAGE}&${param}`,
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching posts");
    return null;
  }
};

export const fetchPost = async (postID: string) => {
  try {
    const res = await axios.get(`${CADDY_URL}/post?id=${postID}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching post");
    return null;
  }
};

export const fetchComments = async (postID: string) => {
  try {
    const res = await axios.get(
      `${CADDY_URL}/comments?post_id=${postID}`,
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching comments");
    return null;
  }
};

export const fetchCommentsCount = async (postID: string) => {
  const res = await axios.get(
    `${API_BASE_URL}/comments/count?post_id=${postID}`,
  );
  return res.data;
};

export const fetchLikes = async (postID: string, user: string) => {
  const res = await axios.get(
    `${API_BASE_URL}/post/likes?id=${postID}&user=${user}`,
  );
  return res.data;
};

export const fetchFollowStatus = async (user: string, author: string) => {
  const res = await axios.get(
    `${API_BASE_URL}/user/follow?user=${user}&author=${author}`,
  );
  return res.data;
};

export const fetchLikePost = async (postID: string, user: string) => {
  const res = await axios.post(`${API_BASE_URL}/post/likes?id=${postID}`, {
    user,
  });
  return { liked: res.data.liked, likecount: res.data.likecount };
};

export const fetchFollowUser = async (user: string, author: string) => {
  const res = await axios.post(`${API_BASE_URL}/user/follow`, { user, author });
  return { followed: res.data.followed, pending: res.data.pending };
};
