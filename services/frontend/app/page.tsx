import Link from "next/link";

export default function Page() {

  return (
    <main>
      <h1>nextjs running</h1>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
    </main>
  );
}
