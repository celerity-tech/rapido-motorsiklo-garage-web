"use client"

import { IconTrash } from "@tabler/icons-react"

import { deleteListing } from "@/app/(admin)/admin/listings/actions"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"

export function DeleteListingDialog({
  listingId,
  title,
}: {
  listingId: string
  title: string
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={buttonVariants({ variant: "destructive", size: "sm" })}
      >
        <IconTrash />
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete listing?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove {title} and delete its Cloudinary
            images.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </AlertDialogClose>
          <form action={deleteListing.bind(null, listingId)}>
            <Button type="submit" variant="destructive">
              <IconTrash />
              Delete listing
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
