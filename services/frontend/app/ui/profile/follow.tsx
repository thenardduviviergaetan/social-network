"use client"
import { FollowButtonProfileProps, Param } from "@/app/lib/definitions";
import { Button } from "../button";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { API_BASE_URL } from "@/app/lib/constants";
import useSWR from "swr";
import { fetcher } from "@/app/lib/utils";
import toast from "react-hot-toast";
import { followUser } from "@/app/lib/action";


export default function Follow({ user, param }: { user: string, param: Param }) {
    const { data: followStatus, mutate: mutateFollow } = useSWR(
        `${API_BASE_URL}/user/follow?user=${user}&author=${param.user}`,
        fetcher,
        {
            revalidateOnMount: true,
            revalidateOnFocus: false,
            refreshInterval: 1000,
        },
    );
    const handleFollow = async () => {
        if (followStatus?.followed) {
            toast.error("User unfollowed")
        }
        try {
            const res = await followUser(user, param.user);
            mutateFollow(res);

        } catch (error) {
            console.error(error);
        }
    };
    return (
        <FollowButtonProfile user={user} param={param} handleFollow={handleFollow} followStatus={followStatus}/>
    )
}


function FollowButtonProfile({
    user,
    followStatus,
    handleFollow,
    param
}: FollowButtonProfileProps) {
    return (
        <Button
            onClick={handleFollow}
            className={`${(param?.user === user || !param?.user) ? "hidden" : "block"}
            ${followStatus?.followed ? "bg-gray-700" : "bg-purple-500"}`}
        >
            {followStatus?.followed
                ? (
                    followStatus?.pending
                        ? (
                            <>
                                <span className="mr-2">Pending...</span>
                            </>
                        )
                        : (
                            <>
                                <span className="mr-2">Unfollow</span>
                                <MinusIcon className="w-5 h-5" />
                            </>
                        )
                )
                : (
                    <>
                        <span className="mr-2">Follow</span>
                        <PlusIcon className="w-5 h-5" />
                    </>
                )}
        </Button>
    );
}