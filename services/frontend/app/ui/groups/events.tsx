"use client"
import { Event, Group, User } from "@/app/lib/definitions";
import EventCard from "./event-card";
import useSWR from "swr";
import { fetcher } from "@/app/lib/utils";
import { API_BASE_URL } from "@/app/lib/constants";

export default function Events({ group, user }: { group: Group, user: User | null }) {
    const { data: groupData } = useSWR(
        `${API_BASE_URL}/group?id=${group.id}`,
        fetcher,
        {
            revalidateOnMount: true,
            revalidateOnFocus: false,
            refreshInterval: 5000,
        },
    );
    console.log("groupData", groupData)
    return (
        <>
            {groupData !== undefined ?
                groupData?.events !== null ?
                    //FIXME: no events
                    groupData.events?.map((event:Event, index:number) => {
                        return <EventCard event={event} key={index} user={user?.uuid} />;
                    })
                    :
                    <p className="text-purple-700 font-bold hover:text-purple-500">No events yes</p>
                :
                <p className="text-purple-700 font-bold hover:text-purple-500">No undefined</p>
            }
        </>
    )
}