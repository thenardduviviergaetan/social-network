import { fetchUser } from "@/app/lib/data";
import Details from "@/app/ui/profile/details";
import UserPosts from "@/app/ui/profile/post";

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
  const user = await fetchUser();


  return (
    <div className="grid grid-cols-2 gap-2 w-full m-auto mt-10 ">
      {/* <h1 className="text-2xl font-bold">Profile</h1> */}
      <Details param={searchParams?.user}/>
      <UserPosts page={searchParams?.page}/>
    </div>
  );
}
