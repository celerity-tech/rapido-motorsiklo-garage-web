import { jwtVerify } from "jose"
import { NextResponse, type NextRequest } from "next/server"

const SESSION_COOKIE = "rms_session"

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET

  if (!secret || secret.length < 32) {
    return null
  }

  return new TextEncoder().encode(secret)
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  const secret = getSessionSecret()
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const loginUrl = new URL("/admin/login", request.url)

  if (!secret || !token) {
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const { payload } = await jwtVerify(token, secret)

    if (payload.sub !== (process.env.ADMIN_USERNAME || "admin")) {
      throw new Error("Invalid admin session")
    }

    return NextResponse.next()
  } catch {
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}
