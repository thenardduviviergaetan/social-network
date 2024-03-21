import { fetchGroups, fetchTotalGroupPages } from "@/app/lib/data";
import GroupForm from "@/app/ui/groups/group-form";
import Groups from "@/app/ui/groups/groups";

export default async function Page({ searchParams }:
     { searchParams?: { page?: string}}) {

    const currentPage = Number(searchParams?.page) || 1

    return (
        <div className="flex flex-col h-screen">
            <GroupForm />
            <Groups page={currentPage} />
        </div>
    )
}