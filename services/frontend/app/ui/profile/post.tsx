import { fetchPageNumber, fetchUser } from "@/app/lib/data";
import Pagination from "../dashboard/pagination";
import Posts from "../posts/posts";
import { auth } from "@/auth";

export default async function UserPosts({page}:{page?:string}){
    const user = await fetchUser();
    const session = await auth();
    const currentPage = Number(page) || 1;
    const totalPages = await fetchPageNumber('user', `UUID=${user?.uuid}`);
    return(
        <div >
        <div className="overflow-y-auto max-h-[230px]">
          <Posts page={currentPage} urlSegment={"user/posts"} param={`UUID=${user?.uuid}`} />
        </div>
        <Pagination totalPages={totalPages ?? 0} />
      </div>
    )
}