import {
  fetchGroup,
  fetchUser,
} from "@/app/lib/data";
import { Group } from "@/app/lib/definitions";
import JoinGroupButton from "@/app/ui/groups/join";
import { GroupMembers } from "@/app/ui/groups/group-members";
import InviteComponent from "@/app/ui/groups/invite";
import EventCard from "@/app/ui/groups/event-card";
import CreateEvent from "@/app/ui/groups/event-form";
import GroupDetails from "./group-details";
import Events from "@/app/ui/groups/events";
import GroupPage from "@/app/ui/groups/group";

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
      <div className="bg-white w-auto rounded-lg p-4 shadow-sm flex flex-col mb-8">
        <GroupPage group={group} user={user} params={searchParams}/>
      </div>
  );
}
