import { fetchFollowers, fetchUser } from "@/app/lib/data";
import { Follower, Param } from "@/app/lib/definitions";
import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";


export default async function Followers({ param }: { param?: Param }) {
    const user = await fetchUser(param?.user);
    const session = await auth();

    const followers = await fetchFollowers(param?.user)


    return (
        <>
            <div className="flex flex-col w-auto h-auto bg-purple-700 p-3 rounded-lg">
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
                            <div className=" flex flex-row w-auto h-auto bg-white p-3 rounded-lg mb-2">
                                <Image
                                    src={`http://caddy:8000/api/avatar?id=${follower.uuid}`}
                                    alt="Profile Picture"
                                    width={50}
                                    height={200}
                                    className="rounded-full shadow-xl"
                                />
                                <p>{follower.firstName}&nbsp;</p>
                                <p>{follower.lastName}</p>
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