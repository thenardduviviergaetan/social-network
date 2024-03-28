"use client";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { fetcher } from "@/app/lib/utils";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/app/ui/button";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { CADDY_URL } from "@/app/lib/constants";
import { Event } from "@/app/lib/definitions";

interface Notification {
  uuid: string;
  firstName: string;
  lastName: string;
  group_requested?: number;
}

interface NotificationsProps {
  user: string;
}

interface Invitation {
  groupId: number;
  groupName: string;
  sender: string;
  senderFirstName: string;
  senderLastName: string;
  target: string;
}

export default function Notifications({ user }: NotificationsProps) {
  const [showNotif, setShowNotif] = useState("");

  const { data: pending, mutate } = useSWR(
    `/api/user/followers/pending?user=${user}`,
    fetcher,
    { revalidateOnMount: true, revalidateOnFocus: true, refreshInterval: 1000 },
  );

  const handleAccept = async (followerId: string) => {
    try {
      await axios.post(`/api/user/followers/accept`, {
        user: user,
        follower: followerId,
      });
      mutate();
      toast.success("Follower accepted");
      showNotif === "pending" && setShowNotif("");
    } catch (error) {
      toast.error("Failed to accept follower");
    }
  };

  const handleReject = async (followerId: string) => {
    try {
      await axios.post(`/api/user/followers/reject`, {
        user: user,
        follower: followerId,
      });
      mutate();
      toast.error("Follower rejected");
      showNotif === "pending" && setShowNotif("");
    } catch (error) {
      toast.error("Failed to reject follower");
    }
  };

  return (
    <div className="flex-grow flex flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
      <div className="h-auto w-full rounded-md bg-gray-50 md:block shadow-xl">
        {pending?.length > 0 && (
          <div
            className="flex items-center justify-between h-10 px-4 cursor-pointer"
            onClick={() =>
              setShowNotif(showNotif === "pending" ? "" : "pending")}
          >
            <p className="text-sm font-medium text-gray-600">
              New follow request
              <span className="ml-2 text-md font-bold text-purple-600">
                {pending?.length || 0}
              </span>
            </p>
            <ArrowRightCircleIcon className="w-5 h-5 text-purple-600" />
          </div>
        )}
        {showNotif === "pending" && (
          <div className="flex flex-col space-y-2 p-4">
            {pending?.map((notif: Notification, index: number) => (
              <div
                key={index.toString()}
                className="flex items-center space-x-2"
              >
                <Image
                  className="w-10 h-10 rounded-full"
                  src={`${CADDY_URL}/avatar?id=${notif.uuid}`}
                  alt={`${notif.firstName} ${notif.lastName}`}
                  width={40}
                  height={40}
                />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-800">
                    {`${notif.firstName} ${notif.lastName}`}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      className="text-xs  h-8"
                      onClick={() => handleAccept(notif.uuid)}
                    >
                      Accept
                    </Button>
                    <Button
                      className="text-xs bg-red-600 hover:bg-red-800 h-8"
                      onClick={() => handleReject(notif.uuid)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function GroupNotifications({ user }: NotificationsProps) {
  const [showNotif, setShowNotif] = useState("");

  const { data: pending, mutate } = useSWR(
    `/api/group/manage/pending?user=${user}`,
    fetcher,
    { revalidateOnMount: true, revalidateOnFocus: true, refreshInterval: 1000 },
  );

  const handleAccept = async (user: string, groupId: number) => {
    try {
      await axios.post(`/api/group/manage/accept`, {
        user,
        groupId,
      });
      mutate();
      toast.success("Group request accepted");
      showNotif === "pending" && setShowNotif("");
    } catch (error) {
      toast.error("Failed to accept group request");
    }
  };

  const handleReject = async (user: string, groupId: number) => {
    try {
      await axios.post(`/api/group/manage/reject`, {
        user,
        groupId,
      });
      mutate();
      toast.error("Group request rejected");
      showNotif === "pending" && setShowNotif("");
    } catch (error) {
      toast.error("Failed to reject group request");
    }
  };

  return (
    <div className="flex-grow flex flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
      <div className="h-auto w-full rounded-md bg-gray-50 md:block shadow-xl">
        {pending?.length > 0 && (
          <div
            className="flex items-center justify-between h-10 px-4 cursor-pointer"
            onClick={() =>
              setShowNotif(showNotif === "pending" ? "" : "pending")}
          >
            <p className="text-sm font-medium text-gray-600">
              New Join Group request
              <span className="ml-2 text-md font-bold text-purple-600">
                {pending?.length || 0}
              </span>
            </p>
            <ArrowRightCircleIcon className="w-5 h-5 text-purple-600" />
          </div>
        )}
        {showNotif === "pending" && (
          <div className="flex flex-col space-y-2 p-4">
            {pending?.map((notif: Notification, index: number) => (
              <div
                key={index.toString()}
                className="flex items-center space-x-2"
              >
                <Image
                  className="w-10 h-10 rounded-full"
                  src={`${CADDY_URL}/avatar?id=${notif.uuid}`}
                  alt={`${notif.firstName} ${notif.lastName}`}
                  width={40}
                  height={40}
                />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-800">
                    {`${notif.firstName} ${notif.lastName}`}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      className="text-xs  h-8"
                      onClick={() =>
                        handleAccept(
                          notif.uuid,
                          notif.group_requested as number,
                        )}
                    >
                      Accept
                    </Button>
                    <Button
                      className="text-xs bg-red-600 hover:bg-red-800 h-8"
                      onClick={() =>
                        handleReject(
                          notif.uuid,
                          notif.group_requested as number,
                        )}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function InviteNotifications({ user }: NotificationsProps) {
  const [showNotif, setShowNotif] = useState("");
  const { data: pending, mutate } = useSWR(
    `/api/group/invite/pending?user=${user}`,
    fetcher,
    { revalidateOnMount: true, revalidateOnFocus: true, refreshInterval: 1000 },
  );

  const handleAccept = async (target: string, groupId: number) => {
    try {
      await axios.post(`/api/group/invite/accept`, {
        target,
        groupId,
      });
      mutate();
      toast.success("Group request accepted");
      showNotif === "pending" && setShowNotif("");
    } catch (error) {
      toast.error("Failed to accept group invitation");
    }
  };

  const handleReject = async (target: string, groupId: number) => {
    try {
      await axios.post(`/api/group/invite/reject`, {
        target,
        groupId,
      });
      mutate();
      toast.error("Group invitation rejected");
      showNotif === "pending" && setShowNotif("");
    } catch (error) {
      toast.error("Failed to reject group invitation");
    }
  };
  return (
    <div className="flex-grow flex flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
      <div className="h-auto w-full rounded-md bg-gray-50 md:block shadow-xl">
        {pending?.length > 0 && (
          <div
            className="flex items-center justify-between h-10 px-4 cursor-pointer"
            onClick={() =>
              setShowNotif(showNotif === "pending" ? "" : "pending")}
          >
            <p className="text-sm font-medium text-gray-600">
              New Group Invitation
              <span className="ml-2 text-md font-bold text-purple-600">
                {pending?.length || 0}
              </span>
            </p>
            <ArrowRightCircleIcon className="w-5 h-5 text-purple-600" />
          </div>
        )}
        {showNotif === "pending" && (
          <div className="flex flex-col space-y-2 p-4">
            {pending?.map((notif: Invitation, index: number) => (
              <div
                key={index.toString()}
                className="flex items-center space-x-2"
              >
                <Image
                  className="w-10 h-10 rounded-full"
                  src={`${CADDY_URL}/avatar?id=${notif.sender}`}
                  alt={`${notif.senderFirstName} ${notif.senderLastName}`}
                  width={40}
                  height={40}
                />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-800">
                    {`${notif.senderFirstName} invite you to join `}
                    <span className="ml-2 text-md font-bold text-purple-600">
                      {notif.groupName}
                    </span>
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      className="text-xs  h-8"
                      onClick={() =>
                        handleAccept(
                          notif.target,
                          notif.groupId as number,
                        )}
                    >
                      Accept
                    </Button>
                    <Button
                      className="text-xs bg-red-600 hover:bg-red-800 h-8"
                      onClick={() =>
                        handleReject(
                          notif.target,
                          notif.groupId as number,
                        )}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function EventNotifications({ user }: NotificationsProps) {



  
  const [showNotif, setShowNotif] = useState("");
  // const [count,setCount] = useState(0)
  
  const { data: notif,mutate } = useSWR(
    `/api/group/event?user=${user}`,
    fetcher,
    { revalidateOnMount: true, revalidateOnFocus: true, refreshInterval: 1000 },
    );
    
    const count = notif?.filter(((notification:Event) =>notification.creator_id !== user)).length


    const handleDismiss = async (group_id:number) => {
      try {
        await axios.post(`/api/group/event`,{
          group_id,
          user
        });
        mutate();
        toast.success("Notification dismissed");
        showNotif === "pending" && setShowNotif("");
      } catch (error) {
        toast.error("Failed to dismiss group invitation");
      }
    };

  return(
    <div className="flex-grow flex flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
      <div className="h-auto w-full rounded-md bg-gray-50 md:block shadow-xl">
        {count > 0 && (
          <div
            className="flex items-center justify-between h-10 px-4 cursor-pointer"
            onClick={() =>
              setShowNotif(showNotif === "pending" ? "" : "pending")}
          >
            <p className="text-sm font-medium text-gray-600">
              New Event created
              <span className="ml-2 text-md font-bold text-purple-600">
                {count || 0}
              </span>
            </p>
            <ArrowRightCircleIcon className="w-5 h-5 text-purple-600" />
          </div>
        )}
        {showNotif === "pending" && (
          <div className="flex flex-col space-y-2 p-4">
            {notif?.map((notification: Event, index: number) => (
              notification.creator_id !== user ? 
              <div
                key={index.toString()}
                className="flex items-center space-x-2"
              >
                <Image
                  className="w-10 h-10 rounded-full"
                  src={`${CADDY_URL}/avatar?id=${notification.creator_id}`}
                  alt={`${notification.creator_first_name} ${notification.creator_last_name}`}
                  width={40}
                  height={40}
                />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-800">
                    {`${notification.creator_first_name} just created a new Event !`}
                    <span className="ml-2 text-md font-bold text-purple-600">
                      {notification.name}
                    </span>
                  </p>
                  <div className="flex space-x-2 mt-1">
                    <Button
                      className="text-xs  h-8"
                      onClick={() =>
                        handleDismiss(notification.event_id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
              :""
            ))}
          </div>
        )}
      </div>
    </div>
  )
  
}