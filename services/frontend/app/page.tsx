import Link from 'next/link';
import {getStatus } from '@/app/lib/data'

export default async function Page(){
  const status = await getStatus();
    return (
      <main>
        <h1>Social Network</h1>
        <nav>
          <Link href="/login">
            <span>Login</span>
          </Link>
          <Link href="/register">
            <span>Register</span>
          </Link>
        </nav>
                <div>Status is: {status.status}</div>
      </main>
    )
}