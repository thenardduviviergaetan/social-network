"use client"

import { Group, User } from "@/app/lib/definitions"
import { useState } from "react"
import JoinGroupButton from "./join"
import CreateEvent from "./event-form"
import { GroupMembers } from "./group-members"
import InviteComponent from "./invite"
import Events from "./events"
import GroupDetails from "@/app/dashboard/groups/group/group-details"

export default function GroupPage({ group, user, params }: { group: Group, user: User | null, params?: { page?: string; type?: string; id?: string } }) {
  const [userState, setUserState] = useState(group.members.some((u => u.uuid === user?.uuid)))

  return (
    <div>
      <JoinGroupButton group={group} user={user?.uuid} setState={setUserState} />
      <div className={userState ? "" : "hidden"}>

        <CreateEvent group={group} user={user?.uuid} />

        <div className="h-[80px] w-auto rounded-lg p-4 flex flex-row mb-3 justify-between items-center">
          <p className="text-purple-700 rounded-lg p-3 w-4/12 font-bold text-2xl">
            {group.name}
          </p>
          <p className="font-bold">
            Owned by:{" "}
            <span className="text-purple-700">
              {group.creator_first_name} {group.creator_last_name}
            </span>
          </p>
        </div>
        <div className="border border-grey-600 p-3 rounded-md">
          <p className="font-bold">Description:</p>
          <div className="text-purple-700 rounded-lg p-3 w-auto font-bold">
            {group.description}
          </div>
        </div>
        <div className="flex w-full m-auto justify-between">
          <GroupMembers group={group} />
          <InviteComponent group={group} user={user?.uuid} />
        </div>
        <div className="flex flex-wrap flex-row justify-around mt-8 bg-white rounded-lg shadow-lg w-full h-auto p-5">
          <Events group={group} user={user} />
        </div>
        <GroupDetails user={user} group={group} searchParams={params} />
      </div>
    </div>
  )
}