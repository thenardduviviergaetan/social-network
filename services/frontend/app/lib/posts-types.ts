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