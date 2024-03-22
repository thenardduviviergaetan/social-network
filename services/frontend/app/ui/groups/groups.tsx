import { fetchGroups, fetchTotalGroupPages, fetchUser } from "@/app/lib/data";
import { auth } from "@/auth";
import Pagination from "@/app/ui/dashboard/pagination";
import GroupCard from "./group-card";
import { Group } from "@/app/lib/definitions";

export default async function Groups({ page, type }: { page: number, type?: string }) {
    const groups = await fetchGroups(page,type);
    const user = await fetchUser();
    // const session = await auth();
    const totalPages = await fetchTotalGroupPages();
    //TODO: faire en back le totalgroupage

    console.log("Pages = ", page);
    console.log(groups)
    return (
        <div className="flex flex-wrap justify-center items-baseline bg-purple-700 mt-5 rounded-lg">
            {groups?.map((group: Group) => {
                return (
                    <div key={group.id} className="flex flex-wrap p-4">
                        <GroupCard key={group.id} group={group} user={user} />
                    </div>
                )
            })}
            <div className="align-end">
                <Pagination totalPages={totalPages ?? 0} />
            </div>
        </div>
    )
}