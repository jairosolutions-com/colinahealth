import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "./app/api/login-api/accessToken";

export function middleware(request: NextRequest) {
  const accessToken = getAccessToken();
  console.log(accessToken, "accessToken");
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/dashboard",
    "/patient-overview",
    "/patient-list",
    "/appointments",
  ],
};
