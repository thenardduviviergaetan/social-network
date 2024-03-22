"use client"
import toast from "react-hot-toast"
import { Button } from "../button"
import { FollowButtonProps, Group, JoinButtonProps } from "@/app/lib/definitions"
import { fetchUser } from "@/app/lib/data"
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline"
import axios from "axios"
import { CADDY_URL } from "@/app/lib/constants"
import { joinGroupRequestFetch } from "@/app/lib/action-group"

export default function JoinGroup({ group, user }: JoinButtonProps) {
    console.log(group.id)
    const joinGroupRequest = async () => {
        try {
            const res = await joinGroupRequestFetch(group.id, group.creator_id)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <Button
            onClick={joinGroupRequest}
            className={`${group.creator_id === user ? "hidden" : "block"}`}
        >
            Join ?
        </Button>
    );
}


