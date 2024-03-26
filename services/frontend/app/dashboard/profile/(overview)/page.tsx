import Details from "@/app/ui/profile/details";
import { Followers, Followed } from "@/app/ui/profile/followers";
import UserPosts from "@/app/ui/profile/post";
import Link from "next/link";
import { LINK_STYLE } from "@/app/lib/constants";


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
    <div className="flex flex-col justify-center items-center w-7/12 m-auto">
      <div className="flex flex-row justify-around w-full mb-8">
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
      </div>
      <Details param={searchParams} />
      <UserPosts param={searchParams} />
    </div>
  );
}
