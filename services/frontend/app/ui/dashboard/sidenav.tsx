import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import Notifications, { GroupNotifications, InviteNotifications } from "@/app/ui/dashboard/notifications";
import Chat from "./chat";
import Chat2 from "./chat2";
import { fetchUser } from "@/app/lib/data";

export default async function SideNav() {
  const session = await auth();
  const user = await fetchUser();

  return (
    <div className="flex flex-col px-3 py-4 md:px-2">
        <div className="mb-2 flex h-50 items-end justify-center rounded-md bg-purple-700 p-4 md:h-50">
          <Link href="/dashboard/profile">
            <div className="flex flex-col items-center mb-2">
              <Image
                src={`${session?.user?.picture}`}
                alt="Profile Picture"
                width={100}
                height={100}
                className="rounded-full"
              />
              <h1 className="text-2xl font-bold">
                <span className="text-white hover:text-purple-200">
                  {session?.user?.name}
                </span>
              </h1>
            </div>
          </Link>
        </div>
      <Notifications user={session?.user?.uuid}/>
      <GroupNotifications user={session?.user?.uuid}/>
      <InviteNotifications user={session?.user?.uuid}/>
      {/* <Chat user={session?.user?.uuid}/> */}
      { user && <Chat2 user={user} /> }
      {/* <Chat user={session?.user?.uuid} u={session?.user}/> */}
    </div>
  );
}
