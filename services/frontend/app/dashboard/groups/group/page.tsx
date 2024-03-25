import { fetchGroup, fetchUser } from "@/app/lib/data";
import { Group, User } from "@/app/lib/definitions";
import JoinGroupButton from "@/app/ui/groups/join";
import { GroupMembers } from "@/app/ui/groups/group-members";

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
    <div>
      <JoinGroupButton
        group={group}
        user={user?.uuid}
      />

      {/* TODO Add button to invite followers to group */}

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
      
     <GroupMembers group={group} />
    </div>
  );
}
