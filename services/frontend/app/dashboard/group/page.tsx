import { fetchGroup } from "@/app/lib/data"
import { Group, User } from "@/app/lib/definitions"
import Image from "next/image"
import Link from "next/link"

export default async function Page(
    {
        searchParams,
    }: {
        searchParams?: {
            page?: string
            user?: string
            id?: string
        }
    }) {
    const group = await fetchGroup(searchParams?.id) as Group

    return (
        <div className="text-white">
            <div className="bg-white shadow-xl h-[80px] w-auto rounded-lg p-4 flex flex-row mb-3 justify-between">
                <p className="bg-purple-700 rounded-lg p-3 w-4/12 font-bold">{group.name}</p>
                <p className="bg-purple-700 rounded-lg p-3 w-4/12 font-bold">Owned by : <span>{group.creator_first_name} {group.creator_last_name}</span></p>
            </div>
            <div className="bg-white shadow-xl h-[80px] w-6/12 rounded-lg p-4">
                <div className="bg-purple-700 rounded-lg p-3 w-auto font-bold">{group.description}</div>
            </div>
            <div className="bg-white shadow-lg w-6/12 rounded-lg mt-8 p-5"><span className="text-purple-700 font-bold underline">Members of this group :</span>
                {group.members.map((member: User) => {
                    return (
                        <Link
                            href={{
                                pathname: "/dashboard/profile",
                                query: { user: encodeURIComponent(member.uuid) },
                            }}
                        >
                            <div className=" flex flex-row w-auto h-auto shadow-lg bg-zinc-200 p-3 rounded-lg mb-2 mt-5 justify-start items-center">
                                <Image
                                    src={`http://caddy:8000/api/avatar?id=${member.uuid}`}
                                    alt="Profile Picture"
                                    width={50}
                                    height={200}
                                    className="rounded-full shadow-xl"
                                />
                                <p className="text-purple-700 font-bold">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{member.firstName}&nbsp;{member.lastName}</p>
                            </div>
                        </Link>
                    )
                })}
            </div>
            </div>
            
    )
}