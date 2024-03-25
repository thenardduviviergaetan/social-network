"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL, CADDY_URL } from "@/app/lib/constants";
import { Group, User } from "@/app/lib/definitions";
import useSWR from "swr";
import { fetcher } from "@/app/lib/utils";
import axios from "axios";

export const GroupMembers = ({ group }: { group: Group }) => {
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

  return (
    <div className="bg-white shadow-lg w-6/12 rounded-lg mt-8 p-5">
      <p className="text-purple-700 font-bold underline">
        Members of this group:
      </p>

      {groupData
        ? (
          groupData.map((member: User) => (
            <div key={member.uuid}>
              <Link
                href={{
                  pathname: "/dashboard/profile",
                  query: { user: encodeURIComponent(member.uuid) },
                }}
              >
                <div className="flex flex-row w-auto h-auto shadow-lg bg-zinc-200 p-3 rounded-lg mb-2 mt-5 justify-start items-center">
                  <Image
                    src={`${CADDY_URL}/avatar?id=${member.uuid}`}
                    alt="Profile Picture"
                    width={50}
                    height={200}
                    className="rounded-full shadow-xl"
                  />
                  <p className="text-purple-700 font-bold">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{member
                      .firstName}&nbsp;{member.lastName}
                  </p>
                </div>
              </Link>
            </div>
          ))
        )
        : (
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900">
              </div>
              <p className="mt-2">Loading...</p>
            </div>
          </div>
        )}
    </div>
  );
};
