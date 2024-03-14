import { fetchPosts } from "@/app/lib/data";
import PostCard from "@/app/ui/posts/post-card";

export default async function Posts({ page }: { page: number }) {
    const posts = await fetchPosts(page);
    return (
        posts.map((post: any) => {
            return (
                <PostCard key={post.id} post={post} postID={post.id} />
            );
        })
    );
}