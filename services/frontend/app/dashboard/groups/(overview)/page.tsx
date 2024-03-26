import { fetchGroups, fetchTotalGroupPages } from "@/app/lib/data";
import GroupForm from "@/app/ui/groups/group-form";
import Groups from "@/app/ui/groups/groups";
import Link from "next/link";

export default async function Page(
  { searchParams }: { searchParams?: { page?: string; type?: string } },
) {
  const currentPage = Number(searchParams?.page) || 1;
  return (
    <div className="flex flex-col h-screen">
      <Link
        href="/dashboard/groups/create"
        className="flex h-10 justify-center w-2/12 items-center rounded-lg bg-purple-700 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 active:bg-purple-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
      >
        New Group
      </Link>
      <Groups page={currentPage} type={searchParams?.type} />
    </div>
  );
}
