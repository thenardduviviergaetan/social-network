import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export default async function Page() {

  const session = await auth()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 bg-white shadow-md rounded-md">
        <h1 className="text-3xl font-bold mb-8">Welcome to My Social Network</h1>
        <div className="flex flex-col space-y-4">
          <Link href="/login">
            <span className="bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-md flex items-center justify-center">
              Login
            </span>
          </Link>
          <Link href="/register">
            <span className="bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-md flex items-center justify-center">
              Register
            </span>
          </Link>
        </div>
        <p className="mt-8 text-gray-600">
          This is the home page of My Social Network. Start exploring and connecting with others!
        </p>
      </div>
    </main>
  );
}
