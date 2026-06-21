import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { LoginForm } from "@/components/admin/login-form"
import { Logo } from "@/components/landing/logo"
import { createSession, getSession, verifyPassword } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Admin login",
}

type LoginState = {
  error?: string
}

function safeNextPath(value: FormDataEntryValue | null) {
  const nextPath = typeof value === "string" ? value : "/admin"

  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/admin"
  }

  return nextPath
}

async function login(
  _state: LoginState,
  formData: FormData
): Promise<LoginState> {
  "use server"

  const username = String(formData.get("username") ?? "")
  const password = String(formData.get("password") ?? "")
  const nextPath = safeNextPath(formData.get("next"))

  if (
    username !== (process.env.ADMIN_USERNAME || "admin") ||
    !verifyPassword(password)
  ) {
    return { error: "Invalid username or password." }
  }

  await createSession(username)
  redirect(nextPath)
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>
}) {
  const session = await getSession()

  if (session) {
    redirect("/admin")
  }

  const params = await searchParams
  const nextPath =
    params?.next && params.next.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : "/admin"

  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-md rounded-md border border-border/70 bg-card/70 p-6 shadow-xl shadow-black/30 backdrop-blur-md">
        <div className="mb-8 space-y-5">
          <Logo priority className="h-12" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Marketplace admin
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage motorcycle listings.
            </p>
          </div>
        </div>
        <LoginForm action={login} nextPath={nextPath} />
      </div>
    </main>
  )
}
