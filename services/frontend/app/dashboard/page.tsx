import Link from "next/link";
import { Button } from "@/app/ui/button";
import Posts from "@/app/ui/posts/posts";
import Pagination from "@/app/ui/dashboard/pagination";
import { fetchPageNumber } from "../lib/data";

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
    <main>
      <Link href="/dashboard/posts/create">
        <Button>Create Post</Button>
      </Link>
      <Posts page={currentPage} />
      <Pagination totalPages={totalPages ?? 0} />
    </main>
  );
}
