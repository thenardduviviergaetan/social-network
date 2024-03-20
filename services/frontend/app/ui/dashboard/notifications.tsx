"use client";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { fetcher } from "@/app/lib/utils";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/app/ui/button";
import axios from "axios";

export default function Notifications({
  user,
}: {
  user: string;
}) {
  const [showNotif, setShowNotif] = useState("");

  const { data: pending, mutate } = useSWR(
    `http://localhost:8000/api/user/followers/pending?user=${user}`,
    fetcher,
    { revalidateOnMount: true, revalidateOnFocus: true, refreshInterval: 1000 },
  );

  return (
    <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
      <div className=" h-auto w-full grow rounded-md bg-gray-50 md:block shadow-xl">
        <div className="flex h-10">
          <p>
            You have{" "}
            <span className="text-md font-bold text-purple-600">
              {pending?.length | 0}
            </span>{" "}
            pending followers
          </p>
          <ArrowRightCircleIcon
            className="w-5  h-5 ml-2 text-purple-600 cursor-pointer"
            onClick={() =>
              setShowNotif(showNotif === "pending" ? "" : "pending")}
          />
        </div>
        {showNotif === "pending" && (
          <div className="flex h-40 justify-around overflow-x-auto">
            {pending?.map((notif: any, index: number) => (
              <div key={index.toString()}>
                <div className="flex flex-col justify-center align-middle text-center p-1">
                  <Image
                    className="w-10 h-10 rounded-full m-auto"
                    src={`http://caddy:8000/api/avatar?id=${notif.uuid}`}
                    alt={`${notif.firstName} ${notif.lastName}`}
                    width={40}
                    height={40}
                  />
                  <span>
                    {`${notif.firstName} ${notif.lastName}`}
                  </span>
                </div>
                <div className="flex justify-around">
                  <Button
                    className="mr-1"
                    onClick={() => {
                      axios.post(
                        `http://localhost:8000/api/user/followers/accept`,
                        {
                          user: user,
                          follower: notif.uuid,
                        },
                      );
                      mutate()
                    }}
                  >
                    Accept
                  </Button>
                  <Button className="bg-red-600 hover:bg-red-800" onClick={()=>{
                    axios.post(
                      `http://localhost:8000/api/user/followers/reject`,
                      {
                        user: user,
                        follower: notif.uuid,
                      },
                    );
                    mutate()
                  }}>
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
