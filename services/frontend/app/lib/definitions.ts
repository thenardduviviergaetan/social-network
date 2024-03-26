
export type User = {
    uuid: string
    email: string
    firstName: string
    lastName: string
    dateOfBirth: string
    status: string
    nickname?: string
    about?: string
    picture?: string
}

export type Follower = {
  uuid: string
  firstName: string
  lastName: string
}
export type Param = {
  page?: string
  user?: string
  id?: string
}

export type TokenUser = {
  id: string
  email: string
  name: string
  uuid: string
}

export type Comment = {
  id: number
  author_id: string
  author: string
  post_id: number
  content: string
  image: File | null
  date: string
}

export interface Post {
  id: string;
  author_id: string;
  author: string;
  date: string;
  content: string;
  image?: string;
  status: string;
  authorized?: string;
}

export interface FollowStatus {
  followed: boolean;
  pending: boolean;
}

export interface LikesData {
  liked: boolean;
  likecount: number;
}

export interface PostCardProps {
  post: Post;
  user: string;
  current: string | null | undefined;
}

export interface PrivatePostProps extends PostCardProps {
  followStatus: FollowStatus;
  handleFollow: () => void;
}

export interface PublicPostProps extends PrivatePostProps {
  likesData: LikesData;
  commentsCounter: number;
  handleLike: () => void;
}

export interface FollowButtonProps {
  post: Post;
  user: string;
  followStatus: FollowStatus;
  handleFollow: () => void;
}
export interface GroupButtonProps {
  group: Group;
  user?: string;
}
export type Group = {
  id: number;
  creation_date: string;
  creator_id: string;
  creator_first_name: string;
  creator_last_name: string;
  name: string;
  description: string;
  members: Array<User>;
  events:Array<Event>;
}

export type Event = {
  event_id:number;
  name: string;
  description:string;
  creator_id: string;
  creator_first_name: string;
  creator_last_name:string;
  creation_date: string;
  date: string;
  candidates:Array<{User:string,Choice:string}>;
}
export interface JoinStatus{
    joined:boolean;
    pending:boolean;
}