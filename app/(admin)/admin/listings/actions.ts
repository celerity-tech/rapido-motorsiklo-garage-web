"use server"

import { ListingStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { deleteListingImage, uploadListingImage } from "@/lib/cloudinary"
import type { UploadedImage } from "@/lib/cloudinary"
import { destroySession, getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export type ListingActionState = {
  error?: string
}

const MAX_IMAGES = 4
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

const listingSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  brand: z.string().trim().min(2, "Brand is required"),
  year: z.coerce
    .number()
    .int()
    .min(1970, "Year is too old")
    .max(new Date().getFullYear() + 1, "Year is too far in the future"),
  price: z.coerce.number().int().min(0, "Price must be zero or more"),
  mileageKm: z.coerce.number().int().min(0, "Mileage must be zero or more"),
  engineCc: z.coerce.number().int().min(1, "Engine displacement is required"),
  transmission: z.enum(["Automatic", "Manual", "Semi-automatic"]),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD"]),
  location: z.string().trim().min(2, "Location is required"),
  highlights: z
    .array(z.string().trim().min(1))
    .min(1, "Add at least one highlight")
    .max(6, "Keep highlights concise"),
  featured: z.boolean(),
  postedAt: z.string().trim().min(1, "Posted date is required"),
})

type ParsedListingForm =
  | { data: z.infer<typeof listingSchema>; error?: never }
  | { error: string; data?: never }

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return "Something went wrong"
}

async function requireAdmin() {
  const session = await getSession()

  if (!session) {
    redirect("/admin/login")
  }

  return session
}

function parseListingForm(formData: FormData): ParsedListingForm {
  const result = listingSchema.safeParse({
    title: formData.get("title"),
    brand: formData.get("brand"),
    year: formData.get("year"),
    price: formData.get("price"),
    mileageKm: formData.get("mileageKm"),
    engineCc: formData.get("engineCc"),
    transmission: formData.get("transmission"),
    status: formData.get("status"),
    location: formData.get("location"),
    highlights: formData
      .getAll("highlights")
      .map((value) => String(value).trim())
      .filter(Boolean),
    featured: formData.get("featured") === "on",
    postedAt: formData.get("postedAt"),
  })

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ?? "Check the listing details",
    }
  }

  return { data: result.data }
}

function getImageFiles(formData: FormData) {
  return formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0)
}

function validateImageFiles(files: File[], existingCount = 0) {
  if (existingCount + files.length > MAX_IMAGES) {
    return `A listing can have up to ${MAX_IMAGES} images.`
  }

  for (const file of files) {
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      return "Images must be JPG, PNG, or WebP files."
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return "Each image must be 5 MB or smaller."
    }
  }

  return null
}

function toPostedDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`)
}

function revalidateListingPaths(id?: string) {
  revalidatePath("/")
  revalidatePath("/marketplace")

  if (id) {
    revalidatePath(`/marketplace/${id}`)
  }
}

export async function createListing(
  _state: ListingActionState,
  formData: FormData
): Promise<ListingActionState> {
  await requireAdmin()

  const parsed = parseListingForm(formData)
  if ("error" in parsed) return { error: parsed.error }

  const files = getImageFiles(formData)
  const imageError = validateImageFiles(files)
  if (imageError) return { error: imageError }

  const { status, postedAt, ...data } = parsed.data
  const uploaded: UploadedImage[] = []

  try {
    for (const file of files) {
      uploaded.push(await uploadListingImage(file))
    }

    await prisma.listing.create({
      data: {
        ...data,
        postedAt: toPostedDate(postedAt),
        status: status as ListingStatus,
        images: {
          create: uploaded.map((image, position) => ({
            url: image.url,
            publicId: image.publicId,
            position,
          })),
        },
      },
    })
  } catch (error) {
    await Promise.allSettled(
      uploaded.map((image) => deleteListingImage(image.publicId))
    )
    return { error: getErrorMessage(error) }
  }

  revalidateListingPaths()
  redirect("/admin")
}

export async function updateListing(
  id: string,
  _state: ListingActionState,
  formData: FormData
): Promise<ListingActionState> {
  await requireAdmin()

  const parsed = parseListingForm(formData)
  if ("error" in parsed) return { error: parsed.error }

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: true },
  })

  if (!listing) {
    return { error: "Listing not found." }
  }

  const keptImageIds = formData
    .getAll("existingImageIds")
    .map((value) => String(value))
    .filter(Boolean)

  const keptImages = keptImageIds
    .map((imageId) => listing.images.find((image) => image.id === imageId))
    .filter((image): image is NonNullable<typeof image> => Boolean(image))

  if (new Set(keptImageIds).size !== keptImageIds.length) {
    return { error: "Image order contains duplicates." }
  }

  if (keptImages.length !== keptImageIds.length) {
    return { error: "Image order was invalid. Please refresh and try again." }
  }

  const imagesToDelete = listing.images.filter(
    (image) => !keptImageIds.includes(image.id)
  )

  const files = getImageFiles(formData)
  const imageError = validateImageFiles(files, keptImages.length)
  if (imageError) return { error: imageError }

  const { status, postedAt, ...data } = parsed.data
  const uploaded: UploadedImage[] = []

  try {
    for (const image of imagesToDelete) {
      await deleteListingImage(image.publicId)
    }

    for (const file of files) {
      uploaded.push(await uploadListingImage(file))
    }

    const imageOperations = [
      ...keptImages.map((image, position) =>
        prisma.listingImage.update({
          where: { id: image.id },
          data: { position },
        })
      ),
      ...uploaded.map((image, index) =>
        prisma.listingImage.create({
          data: {
            listingId: id,
            url: image.url,
            publicId: image.publicId,
            position: keptImages.length + index,
          },
        })
      ),
    ]

    await prisma.$transaction([
      prisma.listing.update({
        where: { id },
        data: {
          ...data,
          postedAt: toPostedDate(postedAt),
          status: status as ListingStatus,
        },
      }),
      prisma.listingImage.deleteMany({
        where: {
          id: { in: imagesToDelete.map((image) => image.id) },
        },
      }),
      ...imageOperations,
    ])
  } catch (error) {
    await Promise.allSettled(
      uploaded.map((image) => deleteListingImage(image.publicId))
    )
    return { error: getErrorMessage(error) }
  }

  revalidateListingPaths(id)
  redirect("/admin")
}

export async function deleteListing(id: string) {
  await requireAdmin()

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: true },
  })

  if (!listing) {
    redirect("/admin")
  }

  for (const image of listing.images) {
    await deleteListingImage(image.publicId)
  }

  await prisma.listing.delete({ where: { id } })
  revalidateListingPaths(id)
  redirect("/admin")
}

export async function setListingStatus(id: string, status: ListingStatus) {
  await requireAdmin()

  await prisma.listing.update({
    where: { id },
    data: { status },
  })

  revalidateListingPaths(id)
}

export async function logout() {
  await destroySession()
  redirect("/admin/login")
}
