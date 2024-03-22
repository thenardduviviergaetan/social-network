import { fetchFollowers, fetchFollowed } from "@/app/lib/data";
import { Follower, Param } from "@/app/lib/definitions";
import Image from "next/image";
import Link from "next/link";
import { CADDY_URL } from "@/app/lib/constants";

export async function Followers({ param }: { param?: Param }) {
    const followers = await fetchFollowers(param?.user)
    const user = await fetchUser(param?.user)
    return (
        <>
            <div className="flex flex-col w-auto h-auto bg-purple-700 p-3 rounded-lg max-w-7/12 sm:max-w-[450px] md:max-w-[700px]">
                <h1 className="text-white font-bold text-center">Followers</h1>
                {
                followers ?
                followers?.map((follower: Follower, index: number) => {
                    return (
                        <Link key={index}
                            href={{
                                pathname: "/dashboard/profile",
                                query: { user: encodeURIComponent(follower.uuid) },
                            }}
                        >
                            <div className=" flex flex-row w-auto h-auto bg-white p-3 rounded-lg mb-2 justify-start items-center">
                                <Image
                                    src={`${CADDY_URL}/avatar?id=${follower.uuid}`}
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

export async function Followed({param}: {param?: Param}){
    const followed = await fetchFollowed(param?.user)
    return (
        <>
            <div className="flex flex-col w-auto h-auto bg-purple-700 p-3 rounded-lg max-w-7/12 sm:max-w-[450px] md:max-w-[700px]">
                <h1 className="text-white font-bold text-center">Followed</h1>
                {
                followed ?
                followed?.map((follower: Follower, index: number) => {
                    return (
                        <Link key={index}
                            href={{
                                pathname: "/dashboard/profile",
                                query: { user: encodeURIComponent(follower.uuid) },
                            }}
                        >
                            <div className=" flex flex-row w-auto h-auto bg-white p-3 rounded-lg mb-2 justify-start items-center">
                                <Image
                                    src={`${CADDY_URL}/avatar?id=${follower.uuid}`}
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
                <p className="w-full text-center text-white font-extrabold">Not following anyone</p>
                }
            </div>
        </>
    )
}