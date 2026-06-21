"use client"

import { IconLock, IconLogin2, IconUser } from "@tabler/icons-react"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LoginState = {
  error?: string
}

type LoginAction = (
  state: LoginState,
  formData: FormData
) => Promise<LoginState>

export function LoginForm({
  action,
  nextPath,
}: {
  action: LoginAction
  nextPath: string
}) {
  const [state, formAction, isPending] = useActionState(action, {})

  useEffect(() => {
    if (state.error) toast.error(state.error)
  }, [state.error])

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />
      {state.error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <IconUser
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="username"
            name="username"
            autoComplete="username"
            className="pl-9"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <IconLock
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="pl-9"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        <IconLogin2 />
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}
