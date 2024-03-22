import SideNav from "@/app/ui/dashboard/sidenav";
import Chat from "@/app/ui/dashboard/chat";
import { Toaster } from "react-hot-toast";
import {auth} from "@/auth";


export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <main className="flex flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <Toaster />
        <Chat user={session?.user?.uuid} />
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </main>
  );
}
