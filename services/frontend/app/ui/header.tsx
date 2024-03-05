import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white-950 shadow-xl">
      <nav className="flex items-center justify-between px-10 py-8">
        <h1 className="text-purple-700 text-4xl font-bold">Social Network</h1>
        <ul className="flex space-x-4">
          <li>
            <Link href="/">
              <span className="text-grey-950 hover:text-purple-700">Home</span>
            </Link>
          </li>
          <li>
            <Link href="/login">
              <span className="text-grey-950 hover:text-purple-700">Login</span>
            </Link>
          </li>
          <li>
            <Link href="/register">
              <span className="text-grey-950 hover:text-purple-700">Register</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
