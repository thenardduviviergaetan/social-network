import { Button } from "@/app/ui/button";
import Details from "@/app/ui/profile/details";
import Followers from "@/app/ui/profile/followers";
import UserPosts from "@/app/ui/profile/post";
import Link from "next/link";


export default async function Page(
  {
    searchParams,
  }: {
    searchParams?: {
      page?: string;
      user?: string
    };
  },
) {


  return (
    <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-4 w-full m-auto mt-10 ">
      <Link href={'/dashboard/group'} className=" w-[80px] flex h-10 items-center rounded-lg bg-purple-700 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 active:bg-purple-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 mt-4">Groups</Link>
      <Details param={searchParams}/>
      <Followers param={searchParams}/>
      <UserPosts param={searchParams}/>
    </div>
  );
}
