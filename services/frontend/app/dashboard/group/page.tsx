// "use client"
import GroupPage from "@/app/ui/groups/group-page";
import Groups from "@/app/ui/groups/groups";
import { CreateGroupButton } from "@/app/ui/groups/info-popup";

export default async function Page({ searchParams }:
    { searchParams?: { page?: string, ID?: string}}) {

    const currentPage = Number(searchParams?.page) || 1

    return (
        <div className="flex flex-col h-full">
            {searchParams?.ID 
                ? <>
                    <GroupPage ID={searchParams.ID}/>
                </>
                : <>
                    <CreateGroupButton />
                    <Groups page={currentPage}/>
                </>
            }
        </div>
    )
}