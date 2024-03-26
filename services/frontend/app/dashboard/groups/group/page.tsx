import { fetchGroup, fetchGroupPosts, fetchPageNumber, fetchPosts, fetchUser } from "@/app/lib/data";
import { Group, User } from "@/app/lib/definitions";
import JoinGroupButton from "@/app/ui/groups/join";
import { GroupMembers } from "@/app/ui/groups/group-members";
import InviteComponent from "@/app/ui/groups/invite";
import EventCard from "@/app/ui/groups/event-card";
import CreateEvent from "@/app/ui/groups/event-form";
import Form from "@/app/ui/posts/create-form";
import Posts from "@/app/ui/posts/posts";
import Pagination from "@/app/ui/dashboard/pagination";

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
  const currentPage = Number(searchParams?.page) || 1
  const totalPages = await fetchPageNumber("/group/posts", `ID=${group.id}`)

  console.log("TotalPages",totalPages);
  console.log(`ID=${group.id}`);

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
        <Form user={user?.uuid} group={group.id}/>
      <div className="flex">
        {/* //TODO Do not add creator to memberlist twice */}
        {/* <GroupMembers group={group}/> */}
      </div>
      <Posts page={currentPage} urlSegment="/group/posts" user={user || undefined} group={group.id}/>
      <Pagination totalPages={totalPages ?? 0}/>
    </div>
  );
}
