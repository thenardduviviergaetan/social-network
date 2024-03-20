import Details from "@/app/ui/profile/details";
import Followers from "@/app/ui/profile/followers";
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


  return (
    <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-4 w-full m-auto mt-10 ">
      {/* <h1 className="text-2xl font-bold">Profile</h1> */}
      <Details param={searchParams}/>
      <Followers param={searchParams}/>
      <UserPosts param={searchParams}/>
    </div>
  );
}
