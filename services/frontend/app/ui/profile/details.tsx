import { fetchFollowers, fetchUser } from "@/app/lib/data";
import { auth } from "@/auth";
import Image from "next/image";
import Toggle from "./toggle";
import Followers from "./followers";
import { Param } from "@/app/lib/definitions";
// import clsx from "clsx";

export default async function Details({ param }: { param?: Param }) {
  const user = await fetchUser(param?.user);
  const session = await auth();
  const followers = await fetchFollowers(param?.user);

  return (
    <>
      <div className="flex flex-col items-center font-bold bg-white p-4 rounded-lg shadow-xl max-w-7/12  sm:max-w-[500px] md:max-w-[700px] text-center overflow-y-auto max-h-[400px] divide-y divide-dashed divide-black ">
        <Image
          src={param?.user ? `http://caddy:8000/api/avatar?id=${param?.user}` : session?.user?.picture}
          alt="Profile Picture"
          width={200}
          height={200}
          className="rounded-full shadow-xl"
        />
        <div className="flex flex-row flex-wrap mt-5">
          {
            user?.nickname &&
            <p className="p-5 w-4/12">
              Nickname:
              <p className=" text-center text-purple-700 hover:text-purple-400">{user?.nickname}</p>
            </p>
          }
          <p className="p-5 w-4/12">
            Date of birth:
            <p className=" text-center text-purple-700 hover:text-purple-400">{user?.dateOfBirth}</p>
          </p>
          <p className="p-5 w-4/12">
            Followers :
            <p className=" text-center text-purple-700 hover:text-purple-400 ">{followers ? followers.length : 0}</p>
          </p>
        </div>
        {user?.about && <p className="font-bold p-5 break-all">About: <p className="text-purple-700">{user?.about}</p></p>}
      </div>
      <div className="flex flex-col justify-evenly items-center rounded-lg bg-white shadow-xl p-3 w-9/12 text-center min-w-[300px] max-w-[600px]">
        <p className="font-bold mt-1 p-3 break-all">Email: <p className="text-purple-700 hover:text-purple-400 mt-1">{user?.email}</p></p>
        <p className="font-bold mt-1 p-3">First Name: <p className="text-purple-700 hover:text-purple-400 mt-1">{user?.firstName}</p></p>
        <p className="font-bold mt-1 p-3">Last Name: <p className="text-purple-700 hover:text-purple-400 mt-1">{user?.lastName}</p></p>
        {
          param?.user ? (param?.user === session?.user?.uuid ? <Toggle user={user} className="p-3">{user?.status} </Toggle> : ""):<Toggle user={user} className="p-3">{user?.status} </Toggle>
        }
      </div>
    </>

  )
}