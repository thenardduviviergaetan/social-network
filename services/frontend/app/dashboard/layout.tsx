import SideNav from "@/app/ui/dashboard/sidenav";
import Chat from "@/app/ui/dashboard/chat";

export default function Layout({ children }: { children: React.ReactNode }) {
  console.log("LAYOUT LOADED");
  return (
    <main className="flex flex-col h-full md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
        <Chat />
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </main>
  );
}
