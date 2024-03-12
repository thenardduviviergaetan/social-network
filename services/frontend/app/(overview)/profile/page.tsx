import Image from "next/image";
import { fetchUser } from "@/app/lib/data";
export default async function Page() {
      const user = await fetchUser();

  return (
    <div className="flex flex-col w-2/3 m-auto mt-10 ">
        test
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="flex justify-around">
        <Image src="/default.png" alt="profile" width={200} height={200} />
      </div>
      <div>
        <p>UUID: {user?.uuid}</p>
        <p>Email: {user?.email}</p>
        <p>First Name: {user?.firstName}</p>
        <p>Last Name: {user?.lastName}</p>
        <p>Date of Birth: {user?.dateOfBirth}</p>
        {user?.nickname && <p>Nickname: {user?.nickname}</p>}
        {user?.about && <p>About: {user?.about}</p>}
      </div>
    </div>
  );
}
