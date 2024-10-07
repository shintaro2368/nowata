"use client";

import { SvgIconComponent } from "@mui/icons-material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { ListItemIcon } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import blue from "@mui/material/colors/blue";
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
            sx={{
              py: 3,
              px: 2,
              backgroundColor: nav.href === pathname ? blue[200] : undefined,
            }}
          >
            <ListItemIcon>
              <nav.icon />
            </ListItemIcon>
            <ListItemText primary={nav.title} />
          </ListItemButton>
        ) : (
          <Fragment key={nav.title}>
            <ListItemButton
              onClick={() => setOpen((prev) => !prev)}
              sx={{ py: 3, px: 2 }}
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
