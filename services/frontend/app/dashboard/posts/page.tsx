import { fetchPost } from '@/app/lib/data';
import {Post} from '@/app/ui/posts/post';

export default async function Page( {
    searchParams,
  }: {
    searchParams?: {
      id?: string;
    };
  },) {

    const id = searchParams?.id;
    if (!id) {
        return <div>Post not found</div>;
    }

    const post = await fetchPost(id);

  return(
    <Post post={post} />
  )
}