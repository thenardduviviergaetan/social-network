import { fetchGroups, fetchTotalGroupPages } from "@/app/lib/data";
import Pagination from "@/app/ui/dashboard/pagination";
import GroupCard from "./group-cards";

export default async function Groups({ page }: { page: number}) {
    const createdGroups = await fetchGroups(true,false,page);
    const memberOfGroups = await fetchGroups(false,true,page)
    const totalPages = await fetchTotalGroupPages()

    return (
        <div className="flex-grow justify-center items-end">
            {/* <div className="flex "> */}
            <h1>My groups</h1>
            <div className="flex felx-wrap justify-center rounded-md border bg-gray-100 shadow-inner p-[10px]">
                { createdGroups && createdGroups.map((group: any) => {
                    return (
                        <GroupCard group={group}/>
                    )
                })}
            </div>
            <h1 className="mt-[30px]">Groups I am part</h1>
            <div className="flex felx-wrap justify-center rounded-md border bg-gray-100 shadow-inner p-[10px]">
                { memberOfGroups && memberOfGroups.map((group: any) => {
                    return (
                        <GroupCard group={group}/>
                    )
                })}
            </div>
            <div className="align-end">
                <Pagination totalPages={totalPages ?? 0} />
            </div>
        </div>
    )
}