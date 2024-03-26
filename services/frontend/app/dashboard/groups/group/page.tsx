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
    <div className="text-white">
      <div>
        <JoinGroupButton
          group={group}
          user={user?.uuid}
        />
        <CreateEvent group={group} user={user?.uuid} />

        <div className="bg-white shadow-xl h-[80px] w-auto rounded-lg p-4 flex flex-row mb-3 justify-between">
          <p className=" text-purple-700 rounded-lg p-3 w-4/12 font-bold">
            {group.name}
          </p>
          <p className="  text-purple-700 rounded-lg p-3 w-4/12 font-bold">
            Owned by :{" "}
            <span>{group.creator_first_name} {group.creator_last_name}</span>
          </p>
        </div>
        <div className="bg-white shadow-xl h-[80px] w-6/12 rounded-lg p-4">
          <div className=" text-purple-700 rounded-lg p-3 w-auto font-bold">
            {group.description}
          </div>
        </div>
        <div className="flex">
          <GroupMembers group={group} />
          <InviteComponent group={group} user={user?.uuid} />
        </div>
      </div>
      <div className="flex flex-wrap flex-row justify-around mt-8 bg-white rounded-lg shadow-lg w-full h-auto p-5">
        {
          //FIXME: no events
          group.events?.map((event, index) => {
            return <EventCard event={event} key={index} user={user?.uuid} />;
          })
        }
      </div>
    </div>
  );
}
