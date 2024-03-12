import { signOut } from "@/auth";
import Link from "next/link";
import { auth } from "@/auth";
import NavLinks from "./dashboard/nav-links";
/**
 * Renders the header component for the social network application.
 * @returns The JSX element representing the header component.
 */
export async function Header() {
  const session = await auth();
  return (
    <header className="bg-white-950 shadow-xl">
      <nav className="flex items-center justify-between px-10 py-8">
        <Link href="/dashboard">
          <h1 className="text-purple-700 text-4xl font-bold">Social Network</h1>
        </Link>
        <ul className="flex space-x-4">
          {session
            ? (
              <>
                <NavLinks />
                <li>
                  <form
                    action={async () => {
                      "use server";
                      await signOut();
                    }}
                  >
                    <button className="text-grey-950 hover:text-purple-700">
                      Logout
                    </button>
                  </form>
                </li>
              </>
            )
            : (
              <>
                <li>
                  <Link href="/login">
                    <span className="text-grey-950 hover:text-purple-700">
                      Login
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/register">
                    <span className="text-grey-950 hover:text-purple-700">
                      Register
                    </span>
                  </Link>
                </li>
              </>
            )}
        </ul>
      </nav>
    </header>
  );
}
