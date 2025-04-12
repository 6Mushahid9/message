// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export { default } from "next-auth/middleware";

// export async function middleware(request: NextRequest) {
//     const token = await getToken({
//         req: request,
//         secret: process.env.NEXTAUTH_SECRET,
//     })
//     const url = request.nextUrl;
    
//     // If user is authenticated and tries to access auth pages, redirect to dashboard
//     if (token && (
//         url.pathname.startsWith("/sign-in") ||
//         url.pathname.startsWith("/sign-up") ||
//         url.pathname.startsWith("/verify") ||
//         url.pathname === "/"
//     )) {
//         return NextResponse.redirect(new URL("/dashboard", request.url));
//     }
    
//     // If user is not authenticated and tries to access protected pages, redirect to login
//     if (!token && url.pathname.startsWith("/dashboard")) {
//         return NextResponse.redirect(new URL("/sign-in", request.url));
//     }
    
//     // Otherwise, continue with the request
//     return NextResponse.next();
// }

// // Remove the default export from next-auth/middleware as we're implementing our own

// export const config = {
//     matcher: [
//         "/sign-in",
//         "/sign-up",
//         "/",
//         "/dashboard/:path*",
//         "/verify/:path*"
//     ]
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    })
    const url = request.nextUrl;
    console.log(url)
    if (token && (
        url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/sign-up") ||
        url.pathname.startsWith("/verify") ||
        url.pathname.startsWith("/")
    )) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
    matcher: [
        "/sign-in",
        "/sign-up",
        "/",
        "/dashboard/:path*",
        "/verify/:path*"
    ]
};