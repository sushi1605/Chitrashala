import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { env } from "~/env";
import { db } from "~/server/db";
import { post, postToTag, postTypeEnum, tag } from "~/server/db/schema";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "~/server/better-auth/server";
import { eq } from "drizzle-orm";

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  secure_url: string;
  resource_type: "image" | "video" | "raw";
  original_filename?: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const visibility =
      (formData.get("visibility") as "public" | "private" | null) || "public";
    const accessType =
      (formData.get("accessType") as "free" | "paid" | null) || "free";
    const price = formData.get("price") as string | null;
    const isDownloadable = formData.get("isDownloadable") === "true" || false;

    // ✅ Parse tags (comma-separated or JSON array)
    let tagsArray: string[] = [];
    const tagsRaw = formData.get("tags");
    if (typeof tagsRaw === "string" && tagsRaw.trim() !== "") {
      try {
        const parsed = JSON.parse(tagsRaw);
        if (Array.isArray(parsed)) {
          tagsArray = parsed.map((t) => t.trim()).filter(Boolean);
        } else {
          tagsArray = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
        }
      } catch {
        tagsArray = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }

    if (!file) {
      return NextResponse.json({ error: "No file found" }, { status: 400 });
    }
    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Upload to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "Chitrashala",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error("Upload failed"));
            resolve(result as CloudinaryUploadResult);
          },
        );
        uploadStream.end(buffer);
      },
    );

    // Determine type
    let postType: (typeof postTypeEnum.enumValues)[number] = "image";
    if (result.resource_type === "video") postType = "video";

    // Insert post
    const postId = uuidv4();
    const [newPost] = await db
      .insert(post)
      .values({
        id: postId,
        userId,
        type: postType,
        title,
        description,
        mediaUrl: result.secure_url,
        thumbnailUrl:
          result.resource_type === "video"
            ? result.secure_url.replace(/\.(mp4|mov|avi)$/, ".jpg")
            : undefined,
        visibility,
        accessType,
        price: accessType === "paid" ? price : null,
        isDownloadable,
      })
      .returning();

    if (!newPost) throw new Error("Failed to save post to database.");

    // ✅ Insert tags (existing or new)
    for (const tagName of tagsArray) {
      const existingTag = await db
        .select()
        .from(tag)
        .where(eq(tag.name, tagName))
        .limit(1);

      let tagId: string | undefined;

      if (existingTag.length > 0 && existingTag[0]?.id) {
        tagId = existingTag[0].id;
      } else {
        const insertedTags = await db
          .insert(tag)
          .values({
            id: uuidv4(),
            name: tagName,
          })
          .returning();

        const newTag = insertedTags[0];
        if (!newTag?.id) throw new Error("Failed to insert or fetch tag ID.");
        tagId = newTag.id;
      }

      if (!tagId) throw new Error("Tag ID could not be determined.");

      await db.insert(postToTag).values({
        postId,
        tagId,
      });
    }

    return NextResponse.json(
      {
        message: "Media uploaded and post created successfully!",
        postId: newPost.id,
        mediaUrl: newPost.mediaUrl,
        type: newPost.type,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      { error: `Post creation failed: ${(error as Error).message}` },
      { status: 500 },
    );
  }
}
export const runtime = "nodejs";
export const bodySizeLimit = "100mb";
