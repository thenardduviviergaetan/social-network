import Image from "next/image";
import { fetchUser } from "@/app/lib/data";
import { auth } from "@/auth";
import Toggle from "@/app/ui/toggle";
export default async function Page() {
  const user = await fetchUser();
  const session = await auth();


  return (
    <div className="grid grid-cols-3 gap-2 w-full m-auto mt-10 ">
      {/* <h1 className="text-2xl font-bold">Profile</h1> */}
      <div className="flex flex-col justify-evenly items-center rounded-lg bg-white shadow-xl p-3 w-9/12 text-center">
        <h1 className="font-bold mt-1 p-3 break-all">Email: <p className="text-purple-700 hover:text-purple-400 mt-1">{user?.email}</p></h1>
        <h1 className="font-bold mt-1 p-3">First Name: <p className="text-purple-700 hover:text-purple-400 mt-1">{user?.firstName}</p></h1>
        <h1 className="font-bold mt-1 p-3">Last Name: <p className="text-purple-700 hover:text-purple-400 mt-1">{user?.lastName}</p></h1>
        <Toggle user={user} className="p-3">{user?.status} </Toggle>
      </div>
      <div className="flex flex-col items-center font-bold bg-white p-4 rounded-lg shadow-xl w-[400px] text-center overflow-y-auto max-h-[400px] divide-y divide-dashed divide-black">
        <Image
          src={`${session?.user?.picture}`}
          alt="Profile Picture"
          width={200}
          height={200}
          className="rounded-full shadow-xl"
        />
        <div className="flex flex-row mt-5">
          {
            user?.nickname &&
            <h1 className="p-5">
              Nickname:
              <p className=" text-center text-purple-700 hover:text-purple-400">{user?.nickname}</p>
            </h1>
          }
          <h1 className="p-5">
              Date of birth:
              <p className=" text-center text-purple-700 hover:text-purple-400">{user?.dateOfBirth}</p>
            </h1>
        </div>
        {user?.about && <h1 className="font-bold p-5 ">About: <p className="text-purple-700">{user?.about}</p></h1>}

      </div>
    </div>
  );
}
