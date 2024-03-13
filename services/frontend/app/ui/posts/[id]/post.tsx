import Link from "next/link";
import { Button } from "@/app/ui/button";

export function DisplayPost({ postID }: { postID: string }) {
    
  return (
    <Link href={`/dashboard/posts/${postID}`}>
      <Button>View Post</Button>
    </Link>
  );
}
