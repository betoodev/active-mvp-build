import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /examples (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.betoo.io, demo.localhost:3000)
  const hostname = req.headers.get("host") || "betoo.io";

  /*// Only for demo purposes - remove this if you want to use your root domain as the landing page
  if (hostname === "betoo.io" || hostname === "platforms.vercel.app") {
    return NextResponse.redirect("https://demo.betoo.io");
  }
*/
  /*  You have to replace ".betoo.io" with your own domain if you deploy this example under your domain.
      You can also use wildcard subdomains on .vercel.app links that are associated with your Vercel team slug
      in this case, our team slug is "platformize", thus *.platformize.vercel.app works. Do note that you'll
      still need to add "*.platformize.vercel.app" as a wildcard domain on your Vercel dashboard. */
  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname.replace(`.betoo.io`, "").replace(`.platformize.betoo.io`, "")
      : hostname.replace(`.localhost:3000`, "");
  // rewrites for app pages
  if (currentHost == "app") {
    var token = process.env.COOKIE_NAME as string;
    if (url.pathname === "/login" && req.cookies.get(token)) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    url.pathname = `/app${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // rewrite root application to `/home` folder
  if (hostname === "localhost:3000" || hostname === "betoo.io") {
    url.pathname = `/home${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // rewrite everything else to `/_sites/[site] dynamic route
  url.pathname = `/_sites/${currentHost}${url.pathname}`;
  return NextResponse.rewrite(url);
}
