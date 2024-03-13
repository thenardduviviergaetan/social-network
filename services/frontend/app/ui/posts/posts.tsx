import { fetchPosts } from "@/app/lib/data";
import Post from "@/app/ui/posts/post";

export default async function Posts({ page }: { page: number }) {
    const posts = await fetchPosts(page);
    return (
        posts.map((post: any) => {
            return (
                <Post key={post.id} post={post} postID={post.id} />
            );
        })
    );
}