import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  // ログイン済みであればログイン画面は表示させず、ダッシュボードへリダイレクト
  if (req.auth && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
