import { fetchFollowed, fetchFollowers, fetchUser } from "@/app/lib/data";
import { auth } from "@/auth";
import Image from "next/image";
import Toggle from "@/app/ui/profile/toggle";
import { Param } from "@/app/lib/definitions";
import { CADDY_URL } from "@/app/lib/constants";
import { Followed, Followers } from "./followers";

export default async function Details({ param }: { param?: Param }) {
  const user = await fetchUser(param?.user);
  const session = await auth();
  const followers = await fetchFollowers(param?.user);
  const followed = await fetchFollowed(param?.user);

  return (
    <>
      <div className="flex flex-col items-center font-bold bg-white p-4 rounded-lg shadow-xl text-center divide-y divide-dashed divide-black w-full mb-8 md:min-w-[450px] min-w-[300px]">
        {/* <div className="flex flex-col items-center font-bold bg-white p-4 rounded-lg shadow-xl max-w-7/12  sm:max-w-[500px] md:max-w-[700px] text-center overflow-y-auto max-h-[400px] divide-y divide-dashed divide-black "> */}
        <Image
          src={param?.user
            ? `${CADDY_URL}/avatar?id=${param?.user}`
            : session?.user?.picture}
          alt="Profile Picture"
          width={200}
          height={200}
          className="rounded-full shadow-xl m-5"
        />
        <div className="flex flex-col w-3/4 justify-center m-auto">
          <div className="flex flex-row flex-wrap mt-5 justify-center">
            {user?.nickname &&
              (
                <h3 className="p-5 w-4/12">
                  Nickname: 
                  <p className=" text-center text-purple-700 hover:text-purple-400">
                    {user?.nickname}
                  </p>
                </h3>
              )}
            <h3 className="p-5 w-4/12">
              Date of birth:
              <p className=" text-center text-purple-700 hover:text-purple-400">
                {user?.dateOfBirth}
              </p>
            </h3>
          </div>
          <div className="flex flex-row flex-wrap justify-center mt-5">
            <h3 className="p-5 w-4/12">
              Followers :
              <p className=" text-center text-purple-700 hover:text-purple-400 ">
                {followers ? followers.length : 0}
              </p>
            </h3>
            <h3 className="p-5 w-4/12">
              Followed :
              <p className=" text-center text-purple-700 hover:text-purple-400 ">
                {followed ? followed.length : 0}
              </p>
            </h3>
          </div>
        </div>
        {user?.about && (
          <h3 className="font-bold p-5 break-all">
            About: <p className="text-purple-700">{user?.about}</p>
          </h3>
        )}
      </div>

      <div className="flex flex-row flex-wrap justify-evenly items-center rounded-lg bg-white shadow-xl p-3 m-auto w-full h-auto">
        <div className="w-1/3 text-center">
          <h3 className="font-bold mt-1 p-3 break-all">
            Email:{" "}
            <p className="text-purple-700 hover:text-purple-400 mt-1">
              {user?.email}
            </p>
          </h3>
          <h3 className="font-bold mt-1 p-3">
            First Name:{" "}
            <p className="text-purple-700 hover:text-purple-400 mt-1">
              {user?.firstName}
            </p>
          </h3>
          <h3 className="font-bold mt-1 p-3">
            Last Name:{" "}
            <p className="text-purple-700 hover:text-purple-400 mt-1">
              {user?.lastName}
            </p>
          </h3>
          {param?.user
            ? (param?.user === session?.user?.uuid
              ? <Toggle user={user} className="p-3">{user?.status}</Toggle>
              : "")
            : <Toggle user={user} className="p-3">{user?.status}</Toggle>}
        </div>

        <div className="w-2/3 justify-around">
          <Followers param={param} />
          <Followed param={param} />
        </div>
      </div>
    </>
  );
}
