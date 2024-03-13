import { fetchPosts } from "@/app/lib/data";
import Post from "@/app/ui/posts/post";

export default async function Posts() {
    const posts = await fetchPosts();
    return (
        posts.map((post: any) => {
            return (
                <Post key={post.id} post={post} postID={post.id} />
            );
        })
    );
}