import { put } from "@vercel/blob";

export async function uploadFile(location, file) {
  try {
    const result = await put(`${location}${file.name}`, file, {
      contentType: file.type,
      storeId: "store_DFZ8FNQ9RQgOkdzn",  // Pass store ID for uploading
      access: 'public',
      token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN, // Required for write access
    });

    console.log("Uploaded file URL:", result.url);
    return result.url;
  } catch (error) {
    console.error("Error uploading file:", error);
    return "";
  }
}
