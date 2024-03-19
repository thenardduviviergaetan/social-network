import Link from "next/link";
import { Button } from "@/app/ui/button";
import Posts from "@/app/ui/posts/posts";
import Pagination from "@/app/ui/dashboard/pagination";
import { fetchPageNumber } from "@/app/lib/data"

export default async function Page(
  {
    searchParams,
  }: {
    searchParams?: {
      page?: string;
    };
  },
) {
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchPageNumber();
  return (
    <div className="w-auto">
      <Link href="/dashboard/posts/create" className="flex h-10 justify-center w-2/12 items-center rounded-lg bg-purple-700 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 active:bg-purple-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50">
          Create Post
      </Link>
      <Posts page={currentPage} />
      <Pagination totalPages={totalPages ?? 0} />
    </div>
  );
}
