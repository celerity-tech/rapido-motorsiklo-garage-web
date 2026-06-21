"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      richColors
      toastOptions={{
        classNames: {
          toast:
            "border-border bg-popover text-popover-foreground shadow-lg shadow-black/40",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-secondary text-secondary-foreground",
        },
      }}
    />
  )
}
