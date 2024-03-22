'use client';
import { revalidatePath } from "next/cache";
import { redirect, useRouter } from "next/navigation";

export default function GroupCard({ group } : { group: any }) {
    const { push } = useRouter()

    return (
        <div onClick={() => { push(`/dashboard/group?ID=${group.id}`)}} className="h-[70px] w-1/2 mx-[5px] rounded-md bg-purple-300 p-[10px] hover:cursor-pointer shadow">
            <h1>{group.name}</h1>
        </div>
    )
}
