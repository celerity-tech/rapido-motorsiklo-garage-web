import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"

export const SESSION_COOKIE = "rms_session"

export type Session = {
  username: string
}

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 10

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET

  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters")
  }

  return new TextEncoder().encode(secret)
}

function getAdminUsername() {
  return process.env.ADMIN_USERNAME || "admin"
}

export function verifyPassword(plain: string) {
  return plain === (process.env.ADMIN_PASSWORD || "admin")
}

export async function signSession(username: string) {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(username)
    .sign(getSessionSecret())
}

export async function verifySessionToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret())
    const username =
      typeof payload.sub === "string"
        ? payload.sub
        : typeof payload.username === "string"
          ? payload.username
          : null

    if (!username || username !== getAdminUsername()) {
      return null
    }

    return { username }
  } catch {
    return null
  }
}

export async function createSession(username = getAdminUsername()) {
  const token = await signSession(username)
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) return null

  return verifySessionToken(token)
}

export async function destroySession() {
  const cookieStore = await cookies()

  cookieStore.delete(SESSION_COOKIE)
}
