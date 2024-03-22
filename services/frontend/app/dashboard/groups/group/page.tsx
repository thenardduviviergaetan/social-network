import { joinGroupRequestFetch } from "@/app/lib/action-group"
import { fetchGroup, fetchUser } from "@/app/lib/data"
import { Group, User } from "@/app/lib/definitions"
import { Button } from "@/app/ui/button"
import JoinGroup from "@/app/ui/groups/join"
import Image from "next/image"
import Link from "next/link"
import toast from "react-hot-toast"
import useSWR from "swr"

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
    const user = await fetchUser();
    console.log("group :", group)
    console.log('group.creator_id', group.creator_id)
    console.log('user.uuid', user?.uuid)

    // const { data: joinStatus, mutate: mutateJoin } = useSWR(
    //     `${API_BASE_URL}/user/follow?user=${user}&author=${group.author_id}`, TODO: changer cette url
    //     fetcher,
    //     {
    //       revalidateOnMount: true,
    //       revalidateOnFocus: false,
    //       refreshInterval: 1000,
    //     },
    //   );

    // const joinGroupRequest = async () => {
    //     try {
    //         const res = await joinGroupRequestFetch(group.id, group.creator_id)
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }

    return (
        <div className="text-white">
            <div className="bg-white shadow-xl h-[80px] w-auto rounded-lg p-4 flex flex-row mb-3 justify-between">
                <p className=" text-purple-700 rounded-lg p-3 w-4/12 font-bold">{group.name}</p>
                <p className="  text-purple-700 rounded-lg p-3 w-4/12 font-bold">Owned by : <span>{group.creator_first_name} {group.creator_last_name}</span></p>
            </div>
            <div className="bg-white shadow-xl h-[80px] w-6/12 rounded-lg p-4">
                <div className=" text-purple-700 rounded-lg p-3 w-auto font-bold">{group.description}</div>
            </div>
            <div className="bg-white shadow-lg w-6/12 rounded-lg mt-8 p-5"><p className="text-purple-700 font-bold underline">Members of this group :</p>
                {/* { group.creator_id == user?.uuid ? "" :<><p className="text-black">Want to </p> <JoinGroup group={group}/></>} TODO: FAIRE CA UNE FOIS 
            QUE J'AI FINI LE FETCH PENDING*/}
                <p className="text-black">Want to </p> <JoinGroup
                    group={group}
                    user={user?.uuid}
                    // joinGroupRequest={joinGroupRequest}
                />

                {group.members.map((member: User, index) => {
                    return (
                        <div key={index}>
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
                        </div>
                    )
                })}
            </div>
        </div>

    )
}

