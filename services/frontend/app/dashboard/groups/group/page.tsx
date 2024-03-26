import { API_BASE_URL } from "@/app/lib/constants"
import { fetchGroup, fetchUser } from "@/app/lib/data"
import {Group, User } from "@/app/lib/definitions"
import EventCard from "@/app/ui/groups/event-card"
import CreateEvent from "@/app/ui/groups/event-form"
import JoinGroup from "@/app/ui/groups/join"
import axios from "axios"
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
    const user = await fetchUser();

    return (
        <div className="text-white">
            <div className="bg-white shadow-xl h-[80px] w-auto rounded-lg p-4 flex flex-row mb-3 justify-between">
                <p className=" text-purple-700 rounded-lg p-3 w-4/12 font-bold">{group.name}</p>
                <p className="  text-purple-700 rounded-lg p-3 w-4/12 font-bold">Owned by : <span>{group.creator_first_name} {group.creator_last_name}</span></p>
            </div>
            <div className="bg-white shadow-xl h-[80px] w-6/12 rounded-lg p-4">
                <div className=" text-purple-700 rounded-lg p-3 w-auto font-bold">{group.description}</div>
            </div>
            <CreateEvent group={group} user={user?.uuid}/>
            <div className="bg-white shadow-lg w-6/12 rounded-lg mt-8 p-5"><p className="text-purple-700 font-bold underline">Members of this group :</p>
                <JoinGroup
                    group={group}
                    user={user?.uuid}
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
            <div className="flex flex-wrap flex-row justify-around mt-8 bg-white rounded-lg shadow-lg w-full h-auto p-5">
            {
                //FIXME: no events
                group.events?.map((event,index)=>{
                    return(
                        <EventCard event={event} key={index} user={user?.uuid} />
                    )
                })
            }
            </div>
        </div>

    )
}

