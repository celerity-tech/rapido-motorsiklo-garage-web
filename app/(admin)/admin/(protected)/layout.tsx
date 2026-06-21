import { IconExternalLink, IconLogout2 } from "@tabler/icons-react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { logout } from "@/app/(admin)/admin/listings/actions"
import { Logo } from "@/components/landing/logo"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo priority className="h-9" />
            <span className="hidden text-sm font-semibold uppercase tracking-wider text-muted-foreground sm:inline">
              Admin
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/" target="_blank" />}
              nativeButton={false}
            >
              View site
              <IconExternalLink />
            </Button>
            <form action={logout}>
              <Button type="submit" variant="ghost" size="sm">
                <IconLogout2 />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        {children}
      </main>
    </div>
  )
}
