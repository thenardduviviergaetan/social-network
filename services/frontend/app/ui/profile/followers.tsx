import { fetchFollowers, fetchUser } from "@/app/lib/data";
import { Follower, Param } from "@/app/lib/definitions";
import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";


export default async function Followers({ param }: { param?: Param }) {
    const followers = await fetchFollowers(param?.user)
    return (
        <>
            <div className="flex flex-col w-auto h-auto bg-purple-700 p-3 rounded-lg max-w-7/12 sm:max-w-[450px] md:max-w-[700px]">
                {
                followers ?
                followers?.map((follower: Follower) => {
                    return (
                        <Link
                            href={{
                                pathname: "/dashboard/profile",
                                query: { user: encodeURIComponent(follower.uuid) },
                            }}
                        >
                            <div className=" flex flex-row w-auto h-auto bg-white p-3 rounded-lg mb-2 justify-start items-center">
                                <Image
                                    src={`http://caddy:8000/api/avatar?id=${follower.uuid}`}
                                    alt="Profile Picture"
                                    width={50}
                                    height={200}
                                    className="rounded-full shadow-xl"
                                />
                                <p className="text-purple-700 font-bold">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{follower.firstName}&nbsp;{follower.lastName}</p>
                            </div>
                        </Link>
                    )
                })
                :
                <p className="w-full text-center text-white font-extrabold">No followers</p>
                }
            </div>
        </>
    )
}