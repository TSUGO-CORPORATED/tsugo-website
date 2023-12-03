import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import profilePic from "./../../public/Mark.jpg";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import SignOut from "../auth/sign-out";

export default function Navbar() {
  const pathname = usePathname();

  return (
<AppBar position="static"  sx={{ bgcolor: "black" }}>
  <Toolbar>
    <Link
      href={
        pathname === "/" ||
        pathname === "/log-in" ||
        pathname === "/sign-up"
          ? "/"
          : "/dashboard"
      }
      style={{ textDecoration: "none" }}
    >
      <Typography
        variant="h6"
        component="div"
        sx={{
          flexGrow: 1,
          cursor: "pointer",
          color: "white",
          fontWeight: "bold"
        }}
      >
        Tsugo/都合
      </Typography>
    </Link>
    {pathname === "/" ||
    pathname === "/log-in" ||
    pathname === "/sign-up" ? (
      <div style={{ marginLeft: "auto" }}>
        <Button color="inherit">
          <Link href="/log-in" style={{ textDecoration: "none" }}>
            <Typography sx={{ color: "white" }}>Log In</Typography>
          </Link>
        </Button>
        <Button color="inherit">
          <Link href="/sign-up" style={{ textDecoration: "none" }}>
            <Typography sx={{ color: "white" }}>Sign Up</Typography>
          </Link>
        </Button>
      </div>
    ) : (
      <div style={{ marginLeft: "auto" }}>
        <IconButton color="inherit">
          <Avatar src={profilePic.src} alt="Avatar" />
        </IconButton>
        <Button color="inherit">
          <Link href="/log-in" style={{ textDecoration: "none" }}>
            <Typography sx={{ color: "white" }}>
              <SignOut />
            </Typography>
          </Link>
        </Button>
        <Button color="inherit">
          <Link href="/profile" style={{ textDecoration: "none" }}>
            <Typography sx={{ color: "white" }}>Profile</Typography>
          </Link>
        </Button>
      </div>
    )}
  </Toolbar>
</AppBar>

  );
}
