import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({
  pages: {
    signIn: "/login"
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/portfolio/:path*",
    "/watchlist/:path*",
    "/research/:path*",
    "/themes/:path*",
    "/alerts/:path*",
    "/reports/:path*",
    "/settings/:path*"
  ]
};
