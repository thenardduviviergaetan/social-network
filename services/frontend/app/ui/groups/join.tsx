"use client"
import { Button } from "../button"
import {GroupButtonProps } from "@/app/lib/definitions"

import { joinGroupRequestFetch } from "@/app/lib/action-group"

export default function JoinGroup({ group, user }: GroupButtonProps) {
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
            className={`${group.creator_id === user ? "hidden" : "block"} mt-3`} //TODO: gerer pour que ce soit tous les members et pas juste le createur
        >
            Want to join ?
        </Button>
    );
}


