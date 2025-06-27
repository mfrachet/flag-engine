import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="px-4 py-2 flex justify-between items-center">
      <div>Logo</div>
      <ul className="flex gap-4 items-center">
        <li>
          <NavLink href="/">Home</NavLink>
        </li>
        <li>
          <NavLink href="/about">About</NavLink>
        </li>
        <li>
          <NavLink href="/dashboard">Dashboard</NavLink>
        </li>
      </ul>
    </nav>
  );
};

interface NavLinkProps {
  children: React.ReactNode;
  href: string;
}

const NavLink = ({ children, href }: NavLinkProps) => {
  return (
    <Link href={href} className="">
      {children}
    </Link>
  );
};
