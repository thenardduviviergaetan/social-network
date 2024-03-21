import SideNav from '@/app/ui/dashboard/sidenav';
import Chat from '@/app/ui/dashboard/chat';
// import { auth } from '@/auth';
import { fetchUser } from '../lib/data';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await fetchUser()
  return (
        <main className="flex flex-col md:flex-row md:overflow-hidden">
            <div className='w-full flex-none md:w-64'>
                <SideNav />
            </div>
            <Chat user={user} />
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </main>
    )
}