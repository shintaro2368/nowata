"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SvgIconComponent } from "@mui/icons-material";

export type Nav = {
  icon: SvgIconComponent;
  title: string;
  href: string;
};

export function NavList({ navs }: { navs: Nav[] }) {
  const pathname = usePathname();
  console.log("pathname", pathname);

  return (
    <div className="flex flex-col">
      {navs.map((nav, index) => (
        <Link
          key={index}
          href={nav.href}
          className={nav.href === pathname ? "bg-blue-50" : ""}
        >
          <div className="flex gap-2 items-center p-5">
            <nav.icon />
            <p className="text-lg font-semibold text-gray-700 ">{nav.title}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
