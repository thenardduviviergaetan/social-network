import { fetchPost } from '@/app/lib/data';

export default async function Page({ params }: { params: { postID: string }}) {
    const post = await fetchPost(params.postID);
    return (
        <div>
            <h1>
                //FIXME
            </h1>
        </div>
    );
}