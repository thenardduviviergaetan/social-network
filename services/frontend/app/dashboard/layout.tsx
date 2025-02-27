import SideNav from "@/app/ui/dashboard/sidenav";
import Chat from "@/app/ui/dashboard/chat";
import { Toaster } from "react-hot-toast";
import {auth} from "@/auth";
import { fetchFollowed, fetchFollowers, fetchUser } from "../lib/data";


export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const followers = await fetchFollowers(session?.user?.uuid);
  const followed = await fetchFollowed(session?.user?.uuid);
  let usersTab:string[]
  usersTab=[];
  return (
    <main className="flex flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <Toaster />
        <Chat user={session?.user?.uuid} followers={followers} followed={followed} followerUUIDS={usersTab}/>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </main>
  );
}

//TODO GROUPS CREATION REAL TIME FOR CHAT
//TODO FOLLOWERS AND FOLLOWED REAL TIME