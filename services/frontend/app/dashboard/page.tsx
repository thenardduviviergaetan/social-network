import Link from 'next/link';
import { Button } from '@/app/ui/button';
import Posts from '@/app/ui/posts/posts';

export default async function Page() {

  return (

    <main>
      <Link href="/dashboard/posts/create">
        <Button>Create Post</Button>
      </Link>
      <Posts />
    </main>
  );
}
