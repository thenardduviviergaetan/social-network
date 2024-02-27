import Link from 'next/link'


async function getData(){
  const res = await fetch('http://localhost:8080/');
  const data = res.json();
  return data;

}

export default async function Page(){
  const status = await getData();
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