import { fetchGroups, fetchTotalGroupPages, fetchUser } from "@/app/lib/data";
import { auth } from "@/auth";
import Pagination from "@/app/ui/dashboard/pagination";
import GroupCard from "./group-card";
import { Group } from "@/app/lib/definitions";

export default async function Groups({ page, type }: { page: number, type?: string }) {
    const groups = await fetchGroups(page, type);
    const user = await fetchUser();
    const totalPages = await fetchTotalGroupPages();
    
    if (!groups) {
        return (
            <div className="flex flex-wrap justify-center items-baseline bg-purple-700 mt-5 rounded-lg">
                <p className="text-white">No groups found</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center items-center mt-5 rounded-lg">
            {groups?.map((group: Group) => (
                <div key={group.id} className="flex flex-wrap flex-row p-4 rounded-lg bg-white shadow-xl w-[300px] mt-5 mr-5">
                    <GroupCard key={group.id} group={group} user={user} />
                </div>
            ))}
            <div className="mt-5">
                <Pagination totalPages={totalPages ?? 0} />
            </div>
        </div>
    )
}
