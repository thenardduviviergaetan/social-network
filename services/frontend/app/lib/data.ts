import axios, { AxiosResponse } from "axios";
import { User } from "@/app/lib/definitions";
import { auth } from "@/auth";
import { unstable_noStore as noStore } from "next/cache";
import { API_BASE_URL, CADDY_URL, ITEMS_PER_PAGE } from "./constants";
export const GROUPS_PER_PAGE = 10 // Number of groups per page

export const fetchUser = async (uuid?: string) => {
  uuid = uuid ?? (await auth())?.user?.uuid;
  // const session = await auth();
  try {
    const res = await axios.get(
      // `${CADDY_URL}/user?UUID=${uuid}&email=${session?.user?.email}`,
      `${CADDY_URL}/user?UUID=${uuid}`,
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
      `${CADDY_URL}/user/followers?user=${uuid ?? session?.user?.uuid}`,
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching user data");
    return null;
  }
};
export const fetchFollowed = async (uuid?: string) => {
  const session = await auth();
  try {
    const res = await axios.get(
      `${CADDY_URL}/user/followed?user=${uuid ?? session?.user?.uuid}`,
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
      `${API_BASE_URL}/${urlSegment}?page=${pageNumber}&limit=${ITEMS_PER_PAGE}&${param}`,
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
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

export const fetchJoinStatus = async (user: string, groupID: number) => {
  const res = await axios.get(
    `${API_BASE_URL}/group/join?user=${user}&group=${groupID}`,
  );
  return res.data;
};

/////////////////>- GROUPS -</////////////////

async function fetchGlobal(url: string, err: string) {
    try {
        const res = await axios.get(`${CADDY_URL}${url}`)
        return res.data
    } catch (error) {
        console.log(err);
        console.log(error);
        return null
    }
}

//TODO WE COULD MAKE A GOOD PAGINATION FOR GROUPS TOO
export const fetchTotalGroupPages = async () => {
    return fetchGlobal(
        `/groups?totalPages=true`,
        'Error fetching total group pages'
    )
}

export const fetchGroups = async (pageNumber: number,type?:string) => {
    const user = await fetchUser()
    return fetchGlobal(
        `/groups?page=${pageNumber}&limit=${GROUPS_PER_PAGE}&user=${user?.uuid}&type=${type}`,
        'Error fetching groups')
}

export const fetchGroup = async (groupeID?: string) => {
    return fetchGlobal(
        `/group?id=${groupeID}`,
        `Error fetching group with ID ${groupeID}`
    )
}

export const fetchGroupPosts = async (groupeID?: string) => {
    return fetchGlobal(
        `/group/posts?ID=${groupeID}`,
        `Error fetching group with ID ${groupeID}`
    )
}

export const fetchGroupMembers = async (groupeID?: string) => {
    return fetchGlobal(
        `/group/members?id=${groupeID}`,
        `Error fetching group members with ID ${groupeID}`
    )
}

export const participateEvent = async (event_id:number,type:string, user?:string) => {
    try {
      console.log("event",event_id)
      const res = await axios.post(`${API_BASE_URL}/group/event/join`,
      {
        type,
        event_id,
        user
      })
      return res.data
    } catch (error) {
      console.error(error)
    }
}