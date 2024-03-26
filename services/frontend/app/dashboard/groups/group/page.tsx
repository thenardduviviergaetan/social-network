import { fetchGroup, fetchUser } from "@/app/lib/data";
import { Group, User } from "@/app/lib/definitions";
import JoinGroupButton from "@/app/ui/groups/join";
import { GroupMembers } from "@/app/ui/groups/group-members";
import InviteComponent from "@/app/ui/groups/invite";
import EventCard from "@/app/ui/groups/event-card";
import CreateEvent from "@/app/ui/groups/event-form";
import JoinGroup from "@/app/ui/groups/join";
import Image from "next/image";
import Link from "next/link";
import { CADDY_URL } from "@/app/lib/constants";

export default async function Page(
  {
    searchParams,
  }: {
    searchParams?: {
      page?: string;
      user?: string;
      id?: string;
    };
  },
) {
  const user = await fetchUser();
  const group = await fetchGroup(searchParams?.id) as Group;

  return (
    <div className="bg-white w-auto rounded-lg p-4 shadow-sm flex flex-col">
      <div>
        <JoinGroupButton group={group} user={user?.uuid} />
        <CreateEvent group={group} user={user?.uuid} />

        <div className="h-[80px] w-auto rounded-lg p-4 flex flex-row mb-3 justify-between">
          <p className="text-purple-700 rounded-lg p-3 w-4/12 font-bold">
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
      </div>
      <div className="flex flex-wrap flex-row justify-around mt-8 w-full h-auto p-5">
        {group.events?.length === 0 ? (
          <p>No events</p>
        ) : (
          group.events?.map((event, index) => (
            <EventCard event={event} key={index} user={user?.uuid} />
          ))
        )}
      </div>
    </div>
  );
}
