import Link from "next/link";
import Posts from "@/app/ui/posts/posts";
import Pagination from "@/app/ui/dashboard/pagination";
import { fetchPageNumber } from "@/app/lib/data";
import { auth } from "@/auth";
import { Suspense } from "react";

export default async function Page(
  {
    searchParams,
  }: {
    searchParams?: {
      page?: string;
    };
  },
) {
  const session = await auth();
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchPageNumber("posts");
  
  return (
    <div className="w-auto">
      <Link
        href="/dashboard/posts/create"
        className="flex h-10 justify-center w-2/12 items-center rounded-lg bg-purple-700 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 active:bg-purple-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
      >
        Create Post
      </Link>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900">
              </div>
              <p className="mt-2">Loading...</p>
            </div>
          </div>
        }
      >
        <Posts page={currentPage} urlSegment={"posts"} user={session?.user} />
      </Suspense>
      <Pagination totalPages={totalPages ?? 0} />
    </div>
  );
}
