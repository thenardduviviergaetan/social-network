import { fetchGroups, fetchTotalGroupPages, fetchUser } from "@/app/lib/data";
import { auth } from "@/auth";
import Pagination from "@/app/ui/dashboard/pagination";
import GroupCard from "./group-card";
import { Group } from "@/app/lib/definitions";

export default async function Groups({ page, type }: { page: number, type?: string }) {
    const groups = await fetchGroups(page, type);
    const user = await fetchUser();
    // const session = await auth();
    const totalPages = await fetchTotalGroupPages();
    //TODO: faire en back le totalgroupage

    console.log("Pages = ", page);
    console.log(groups)

    return (
        // <div className="flex flex-wrap justify-center items-baseline bg-white shadow-xl mt-5 rounded-lg">
        <div className="flex flex-wrap flex-row">
            {groups?.map((group: Group) => {
                return (
                    <div key={group.id} className="flex flex-wrap flex-row p-4 rounded-lg bg-white shadow-xl w-[300px] mt-24 mr-5">
                        <GroupCard key={group.id} group={group} user={user} />
                    </div>
                )
            })}
        </div>
    )
    {/* <div className="align-end">
                <Pagination totalPages={totalPages ?? 0} />
            </div> */}
    // </div>
}