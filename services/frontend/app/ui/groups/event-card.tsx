"use client"
import { Event } from "@/app/lib/definitions";
import Link from "next/link";
import { Button } from "../button";
import { participateEvent } from "@/app/lib/data";
import {useEffect, useState } from "react";

export default function EventCard({ event, user }: { event: Event, user?: string }) {

    const check = event.candidates?.some(u => u.User === user && u.Choice !== "no") ||false;
    const checkNo = event.candidates?.some(u=>u.User === user && u.Choice === "no") || false;

    const [stateCheck,setStateCheck] = useState([check,checkNo])
    // const [stateCheckNo,setStateCheckNo] = useState(false)
    

    const participateReq = (opt: string) => {
        switch (opt) {
            case "join":
                console.log("check avant",check)
                setStateCheck([true,true]);
                console.log("check apres",check)
                participateEvent(event.event_id, "join", user)
                break
            case "no":
                setStateCheck([false,true]);
                participateEvent(event.event_id, "no", user)
                break
            case "leave" :
                setStateCheck([false,false]);
                participateEvent(event.event_id,"leave",user)
        }
    }

    return (
        <div className="bg-white shadow-lg rounded-lg w-1/2 h-auto mt-8 p-5">
            <p className="flex text-purple-700 p-3 font-bold justify-between">
                <span className="text-left w-2/3">{event.name}</span>
                <span className="text-xs text-right w-1/3">
                    <i>created at {new Date(event.creation_date).toLocaleDateString("fr")}</i>
                </span>
            </p>
            <p className="text-black p-3">
                <i>Created by</i>{" "}
                <Link href={`/dashboard/profile?user=${event.creator_id}`} className="text-purple-700 font-bold hover:text-purple-500 p-3">
                    {`${event.creator_first_name} ${event.creator_last_name}`}
                </Link>
            </p>
            <p className="text-purple-700 hover:text-purple-500 font-bold p-3">
                <i className="text-black font-normal">Starting at</i> <span>{new Date(event.date).toLocaleDateString("fr")}</span>
            </p>
            {!stateCheck[0] ? (
                <div className="flex flex-col md:flex-row justify-between p-3">
                    <Button className="bg-green-500 mb-2 md:mb-0 md:mr-2" onClick={() => { participateReq("join") }}>
                        Participate
                    </Button>
                    {stateCheck[1] ? "" : (
                        <Button className="bg-green-500" onClick={() => { participateReq("no") }}>
                            No thanks
                        </Button>
                    )}
                </div>
            ) : (
                <Button onClick={() => { participateReq("leave") }} className="bg-red-600">
                    Leave
                </Button>
            )}
            <p className="p-3 text-black text-center break-all w-full">{event.description}</p>
        </div>
    )
}