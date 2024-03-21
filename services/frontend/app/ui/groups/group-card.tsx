import { Group } from "@/app/lib/definitions";
import Link from "next/link";

export default async function GroupCard({ group }: { group: Group }) {
    return (
        <div>
            <p className="p-3 bg-white shadow-xl">Group Name : <span className="text-purple-700 font-bold">{group?.name}</span></p>
            <p className="p-3 bg-white shadow-xl">Administrator : <span className="text-purple-700 font-bold">{group.creator_id}</span></p>
            <p className="p-3 bg-white shadow-xl">Date : <span className="text-purple-700 font-bold">{new Date(group.creation_date).toLocaleDateString('FR')}</span></p>
            <p className="p-3 bg-white shadow-xl">Description : <span className="text-purple-700 font-bold">{group.description}</span></p>
        </div>
    )
}