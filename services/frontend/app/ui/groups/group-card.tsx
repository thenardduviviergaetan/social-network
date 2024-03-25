import { Group, User } from "@/app/lib/definitions";
import Link from "next/link";
import { LINK_STYLE } from "@/app/lib/constants";
import { fetchUser } from "@/app/lib/data";

export default async function GroupCard(
  { group, user }: { group: Group; user: User | null },
) {

  return (
    <>
      <p className="p-3">
        Group Name :{" "}
        <span className="text-purple-700 font-bold">{group?.name}</span>
      </p>
      <p className="p-3">
        Administrator :{" "}
        <span className="text-purple-700 font-bold">
          {group.creator_id === user?.uuid
            ? `${user.firstName} ${user.lastName}(You)`
            : `${await fetchUser(group.creator_id)?.then((res) => res?.firstName + " " + res?.lastName)}`}
        </span>
      </p>
      <p className="p-3">
        Date :{" "}
        <span className="text-purple-700 font-bold">
          {new Date(group.creation_date).toLocaleDateString("FR")}
        </span>
      </p>
      <p className="p-3">
        Description :{" "}
        <span className="text-purple-700 font-bold">{group.description}</span>
      </p>
      <Link
        href={{
          pathname: `/dashboard/groups/group`,
          query: { id: encodeURIComponent(group.id) },
        }}
        className={LINK_STYLE + " text-[12px] text-left w-auto"}
      >
        Go to {group.name}&apos;s Page
      </Link>
    </>
  );
}
