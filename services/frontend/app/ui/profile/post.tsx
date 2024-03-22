import { fetchPageNumber, fetchUser } from "@/app/lib/data";
import Pagination from "../dashboard/pagination";
import Posts from "../posts/posts";
import { Param } from "@/app/lib/definitions";

export default async function UserPosts({param}:{param?:Param}){
    const user = await fetchUser();
    const currentPage = Number(param?.page) || 1;
    const totalPages = await fetchPageNumber('user', `UUID=${param?.user ? param?.user : user?.uuid}`);
    return(
        <div className="overflow-y-auto max-h-auto w-full">
        <div >
          <Posts page={currentPage} urlSegment={"user/posts"} param={`UUID=${param?.user ? param?.user : user?.uuid}`} />
        </div>
        <Pagination totalPages={totalPages ?? 0} />
      </div>
    )
}