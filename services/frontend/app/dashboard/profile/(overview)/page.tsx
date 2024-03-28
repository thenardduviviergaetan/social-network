import Details from "@/app/ui/profile/details";
import UserPosts from "@/app/ui/profile/post";
import Link from "next/link";
import { LINK_STYLE } from "@/app/lib/constants";
import { fetchUser } from "@/app/lib/data";
import FollowButtonProfile from "@/app/ui/profile/follow";


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
const currentUser = await fetchUser();
  return (
    <div className="flex flex-col justify-center items-center w-7/12 m-auto">
      <div className="flex flex-row justify-around w-full mb-8">
      {
      (searchParams?.user === undefined || searchParams?.user === currentUser?.uuid ) ? 
        <>
        <Link
          href={{
            pathname: '/dashboard/groups',
            query: { type: encodeURIComponent("member") }
          }}
          className={LINK_STYLE + " w-auto"}
        >
          My groups
        </Link>
        <Link
          href={{
            pathname: '/dashboard/groups',
            query: { type: encodeURIComponent("all") }
          }}
          className={LINK_STYLE + " w-auto"}
        >
          All groups
        </Link>
      </>: "" }
      <FollowButtonProfile  user={currentUser?.uuid} param={searchParams}/>
    </div>
      <Details param={searchParams} />
      <UserPosts param={searchParams} />
    </div>
  );
}

