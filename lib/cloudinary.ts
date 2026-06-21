import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export type UploadedImage = {
  url: string
  publicId: string
}

export function assertCloudinaryConfigured() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary credentials are required to upload images")
  }
}

export async function uploadListingImage(file: File): Promise<UploadedImage> {
  assertCloudinaryConfigured()

  const bytes = Buffer.from(await file.arrayBuffer())

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "rapido-listings",
        format: "webp",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"))
          return
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        })
      }
    )

    stream.end(bytes)
  })
}

export async function deleteListingImage(publicId: string) {
  if (!publicId) return
  assertCloudinaryConfigured()

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  })
}
