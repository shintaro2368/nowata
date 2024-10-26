"use client";

import { SvgIconComponent } from "@mui/icons-material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { ListItemIcon } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";

export type Nav = {
  icon: SvgIconComponent;
  title: string;
  href?: string;
  subNavs?: Nav[];
};

export function NavList({ navs }: { navs: Nav[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <List component="nav" sx={{ width: "100%" }}>
      {navs.map((nav) =>
        nav.href ? (
          <ListItemButton
            key={nav.title}
            LinkComponent={Link}
            href={nav.href}
            className={`m-3 rounded-lg hover:opacity-90 ${
              nav.href === pathname
                ? "bg-blue-300"
                : "bg-white hover:bg-blue-100"
            }`}
            sx={{
              py: 3,
              px: 2,
              //backgroundColor: nav.href === pathname ? blue[300] : undefined,
            }}
          >
            <ListItemIcon>
              <nav.icon />
            </ListItemIcon>
            <ListItemText primary={nav.title} className="font-bold" />
          </ListItemButton>
        ) : (
          <Fragment key={nav.title}>
            <ListItemButton
              onClick={() => setOpen((prev) => !prev)}
              sx={{ py: 3, px: 2 }}
              className={`m-3 rounded-lg hover:opacity-90 ${
                nav.href === pathname ? "bg-blue-300" : "bg-white"
              }`}
            >
              <ListItemIcon>
                <nav.icon />
              </ListItemIcon>
              <ListItemText primary={nav.title} />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open}>
              <List component="nav" disablePadding>
                {nav.subNavs?.map((subNav) => (
                  <ListItemButton
                    key={subNav.title}
                    LinkComponent={Link}
                    href={subNav.href!!}
                    sx={{ pl: 4 }}
                    className={`m-3 rounded-lg hover:opacity-90 ${
                      subNav.href === pathname
                        ? "bg-blue-300"
                        : "bg-white hover:bg-blue-100"
                    }`}
                  >
                    <ListItemIcon>
                      <subNav.icon />
                    </ListItemIcon>
                    <ListItemText secondary={subNav.title} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </Fragment>
        )
      )}
    </List>
  );
}
