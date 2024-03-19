import Image from "next/image";
import { fetchUser } from "@/app/lib/data";
import { auth } from "@/auth";

export default async function Page() {
  const user = await fetchUser();
  const session = await auth();


  return (
    <div className="grid grid-cols-2 gap-20 justify-around w-full m-auto mt-10 ">
      {/* <h1 className="text-2xl font-bold">Profile</h1> */}
      <div className="flex justify-around flex-col items-center">
        <Image
          src={`${session?.user?.picture}`}
          alt="Profile Picture"
          width={200}
          height={200}
          className="rounded-full p-3"
        />
        {user?.nickname && <h1 className="font-bold bg-white p-4 rounded-lg shadow-xl w-8/12 text-center">Nickname: <p className=" text-center text-purple-700 hover:text-purple-400">{user?.nickname}</p></h1>}
      </div>
      <div className="rounded-lg bg-white shadow-xl p-3 w-6/12">
        <h1 className="font-bold">Email: <p className="text-purple-700 hover:text-purple-400">{user?.email}</p></h1>
        <h1 className="font-bold">First Name: <p className="text-purple-700 hover:text-purple-400">{user?.firstName}</p></h1>
        <h1 className="font-bold">Last Name: <p className="text-purple-700 hover:text-purple-400">{user?.lastName}</p></h1>
      </div>
      <div className="rounded-lg bg-white shadow-xl p-3">
        <h2 className="font-bold">Date of Birth: <p className="text-purple-700 hover:text-purple-400">{user?.dateOfBirth}</p></h2>
      </div>
      <div className="rounded-lg bg-white shadow-xl p-3 w-6/12">
        {user?.about && <h1 className="font-bold">About: <p className="text-purple-700 hover:text-purple-400">{user?.about}</p></h1>}
      </div>
    </div>
  );
}
