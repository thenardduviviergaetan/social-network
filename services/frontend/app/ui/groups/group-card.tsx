import { Group, User } from "@/app/lib/definitions";
import Link from "next/link";
export const LINK_STYLE = " w-[80px] flex h-10 items-center rounded-lg bg-purple-700 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 active:bg-purple-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 mt-4"
export default async function GroupCard({ group, user }: { group: Group, user: User | null }) {
    return (
        <>
            <p className="p-3">Group Name : <span className="text-purple-700 font-bold">{group?.name}</span></p>
            <p className="p-3">Administrator : <span className="text-purple-700 font-bold">{group.creator_id === user?.uuid ? `${user.firstName} ${user.lastName}(You)` : "Need to implement that (get username by uuid"}</span></p>
            <p className="p-3">Date : <span className="text-purple-700 font-bold">{new Date(group.creation_date).toLocaleDateString('FR')}</span></p>
            <p className="p-3">Description : <span className="text-purple-700 font-bold">{group.description}</span></p>
            <Link
                href={{
                    pathname: `/dashboard/groups/group`,
                    query: { id: encodeURIComponent(group.id) }
                }}
                className={LINK_STYLE + " text-[12px] text-left w-auto"}
            >Go to {group.name}&apos;s Page</Link>
        </>

    )
}

