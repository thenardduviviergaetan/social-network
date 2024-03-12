'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

/**
 * Renders the navigation links for the social network application.
 * @returns The JSX element representing the navigation links.
 */
const links = [
    {name: 'Home', href: '/dashboard'},
    {name: 'Profile', href: '/dashboard/profile'},
]

export default function NavLinks() {
    const pathname = usePathname();
    return (
        <>
            {links.map((link) => (
                <li key={link.href}>
                    <Link href={link.href}>
                        <span className={clsx('text-grey-950', {
                            'hover:text-purple-700': pathname !== link.href,
                            'text-purple-700': pathname === link.href,
                        })}>
                            {link.name}
                        </span>
                    </Link>
                </li>
            ))}
        </>
    );
}