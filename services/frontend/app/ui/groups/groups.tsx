import { fetchGroups, fetchTotalGroupPages } from "@/app/lib/data";
import { auth } from "@/auth";
import Pagination from "@/app/ui/dashboard/pagination";

export default async function Groups({ page }: { page: number}) {
    const groups = await fetchGroups(page);
    // const session = await auth();
    const totalPages = await fetchTotalGroupPages()

    console.log("Pages = ",page);

    return (
        <div className="flex-grow flex justify-center items-end">
            { groups && groups.map((post: any) => {
                return (
                    // TODO Create a GroupCard for better readability.
                    // TODO Maybe pass the USERID in the GroupCard so it can 
                    // filter there. For now it's in the fetch.
                    <div>${post}</div>
                )
            })}
            <div className="align-end">
                <Pagination totalPages={totalPages ?? 0} />
            </div>
        </div>
    )
}