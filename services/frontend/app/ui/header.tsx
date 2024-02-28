import Link from "next/link";

export function Header() {
  return (
    <header className="bg-gray-950">
      <nav className="flex items-center justify-between px-10 py-8">
        <h1 className="text-white text-2xl font-bold">Social Network</h1>
        <ul className="flex space-x-4">
          <li>
            <Link href="/">
              <span className="text-white hover:text-gray-300">Home</span>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <span className="text-white hover:text-gray-300">About</span>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <span className="text-white hover:text-gray-300">Contact</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
