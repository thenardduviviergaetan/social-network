import { fetchGroups, fetchTotalGroupPages } from "@/app/lib/data";
import { auth } from "@/auth";
import Pagination from "@/app/ui/dashboard/pagination";
import GroupCard from "./group-card";
import { Group } from "@/app/lib/definitions";

export default async function Groups({ page }: { page: number}) {
    const groups = await fetchGroups(page);
    // const session = await auth();
    const totalPages = await fetchTotalGroupPages()

    console.log("Pages = ",page);
    console.log(groups)

    return (
        <div className="flex-grow flex justify-center items-center">
            {groups?.map((group: Group) => {
                return (
                    <div key={group.id} className="flex flex-wrap p-4">
                        <GroupCard key={group.id} group={group}/>
                    </div>
                )
            })}
            <div className="align-end">
                <Pagination totalPages={totalPages ?? 0} />
            </div>
        </div>
    )
}