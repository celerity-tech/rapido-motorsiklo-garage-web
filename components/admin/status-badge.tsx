import { cn } from "@/lib/utils"

export type AdminListingStatus = "AVAILABLE" | "RESERVED" | "SOLD"

const statusStyles: Record<AdminListingStatus, string> = {
  AVAILABLE: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  RESERVED: "border-amber-500/30 bg-amber-500/15 text-amber-400",
  SOLD: "border-border/60 bg-background/80 text-muted-foreground",
}

const statusLabels: Record<AdminListingStatus, string> = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  SOLD: "Sold",
}

export function StatusBadge({ status }: { status: AdminListingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        statusStyles[status]
      )}
    >
      {status !== "SOLD" && (
        <span className="size-1.5 rounded-full bg-current" aria-hidden />
      )}
      {statusLabels[status]}
    </span>
  )
}
