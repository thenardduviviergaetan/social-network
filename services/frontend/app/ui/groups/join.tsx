"use client";
import { Button } from "../button";
import { JoinButtonProps } from "@/app/lib/definitions";//FIXME:
import { API_BASE_URL } from "@/app/lib/constants";
import useSWR from "swr";
import { fetcher } from "@/app/lib/utils";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { fetchJoinStatus } from "@/app/lib/data";
import { joinGroup } from "@/app/lib/action-group";

export default function JoinGroupButton({ group, user }: JoinButtonProps) {
  const { data: joinStatus, mutate: mutateJoin } = useSWR(
    `${API_BASE_URL}/group/join?user=${user}&group=${group.id}`,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      refreshInterval: 1000,
    },
  );

  useEffect(() => {
    if (user) {
      fetchJoinStatus(user, group.id);
    }
  }, [user, group.id]);

  const handleJoin = async () => {
    try {
      const res = await joinGroup(user, group.id.toString());
      mutateJoin(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      onClick={handleJoin}
      className={`${group.creator_id === user ? "hidden" : "block"}
        ${joinStatus?.followed ? "bg-gray-700" : "bg-purple-500"}`}
    >
      {joinStatus?.followed
        ? (
          joinStatus?.pending
            ? (
              <>
                <span className="mr-2">Pending...</span>
              </>
            )
            : (
              <>
                <span className="mr-2">Quit</span>
                <MinusIcon className="w-5 h-5" />
              </>
            )
        )
        : (
          <>
            <span className="mr-2">Join</span>
            <PlusIcon className="w-5 h-5" />
          </>
        )}
    </Button>
  );
}