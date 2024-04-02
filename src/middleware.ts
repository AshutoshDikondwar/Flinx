import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
    publicRoutes: ["/site", "/api/uploadthing"],
    async afterAuth(auth, req) {
        const url = req.nextUrl;
        const searchParams = url.searchParams.toString();
        let hostname = req.headers;

        const pathWithSearchParam = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`

        const customDomain = hostname.get('host')?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`).filter(Boolean)[0];

        if (customDomain) {
            return NextResponse.rewrite(new URL(`/${customDomain}${pathWithSearchParam}`,req.url))
        }

        if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
            return NextResponse.redirect(new URL(`/agency/sign-in`, req.url))
        }

        if (url.pathname === "/" || url.pathname === "/site" && url.hash === process.env.NEXT_PUBLIC_DOMAIN) {
            return NextResponse.rewrite(new URL("/site", req.url))
        }

        if (url.pathname.startsWith("/agency") || url.pathname.startsWith("/subaccount")) {
            return NextResponse.rewrite(new URL(`${pathWithSearchParam}`, req.url))
        }
    }
});

export const config = {
    // Protects all routes, including api/trpc.
    // See https://clerk.com/docs/references/nextjs/auth-middleware
    // for more information about configuring your Middleware
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};