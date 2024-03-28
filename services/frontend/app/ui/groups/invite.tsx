"use client";
import { API_BASE_URL, CADDY_URL } from "@/app/lib/constants";
import { Group } from "@/app/lib/definitions";
import useSWR from "swr";
import { fetcher } from "@/app/lib/utils";
import Image from "next/image";
import { inviteToGroup } from "@/app/lib/action-group";
import { useEffect, useState } from "react";
import axios from "axios";

export default function InviteComponent({
  group,
  user,
  groupMembers,
}: {
  group: Group;
  user: string;
  groupMembers: any;
}) {
  const followers = useSWR(
    `${API_BASE_URL}/user/followers?user=${user}`,
    fetcher,
  ).data;

  const { data: groupData, error, mutate } = useSWR(
    `${API_BASE_URL}/group/members?id=${group.id}`,
    fetcher,
    { revalidateOnMount: true, revalidateOnFocus: true, refreshInterval: 5000 },
  );

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/group/members?id=${group.id}`,
        );
        mutate(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchGroupMembers();
  }, [group.id, mutate]);

  const [inviteState, setInviteState] = useState(false)

  if (!groupData?.some((member: any) => member.uuid === user)) {
    return (
      <div className="border border-grey-600 w-1/2 rounded-lg p-4 flex justify-center items-center ">
        <p className="text-center text-gray-500">
          Join the group to invite users.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-grey-600 w-1/2 rounded-lg p-4 mt-8">
      <p className="text-purple-700 font-bold underline mb-3">
        Invite followers to this group:
      </p>

      {followers &&
        followers.map((follower: any, index: number) => {
          const isFollowerInGroup = groupData?.some(
            (member: any) => member.uuid === follower.uuid
          );
          return (
            <div
              key={index.toString()}
              className="flex items-center space-x-4"
            >
              <Image
                className="w-10 h-10 rounded-full"
                src={`${CADDY_URL}/avatar?id=${follower.uuid}`}
                alt={`${follower.firstName} ${follower.lastName}`}
                width={40}
                height={40}
              />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {`${follower.firstName} ${follower.lastName}`}
                </p>
                {isFollowerInGroup ? (
                  <p className="text-sm text-gray-500">Already in group</p>
                ) : (
                  <button
                    className="px-2 py-1 text-sm text-white bg-purple-600 rounded hover:bg-purple-900"
                    onClick={() =>{
                      setInviteState(false ? true : true);
                      (inviteState === false) ?
                      inviteToGroup(follower.uuid, group.id, user)
                      :""
                    }}
                  >
                    {inviteState ? "Pending..." : "Invite"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
