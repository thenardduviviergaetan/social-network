import { fetchPosts } from "@/app/lib/data";
import PostCard from "@/app/ui/posts/post-card";
import { auth } from "@/auth";

export default async function Posts({ page }: { page: number }) {
    const posts = await fetchPosts(page);
    const session = await auth();
    return (
        posts.map((post: any) => {
            return (
                <PostCard key={post.id} post={post} postID={post.id} user={session?.user?.uuid} current={session?.user?.name} />
            );
        })
    );
}