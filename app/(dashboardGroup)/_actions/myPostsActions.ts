"use server";
import { IPost } from "@/lib/types";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

type PostState = {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: IPost;
} | null;

export const createPost = async (prevState: PostState, formData: FormData) => {
  const payload = {
    title: formData.get("title"),
    content: formData.get("content"),
    thumbnail: formData.get("thumbnail"),
    tags: (formData.get("tags") as string).split(", "),
    IsPremium: formData.get("isPremium") === "on",
  };
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) {
    // throw new Error("User not logged in");
    return {
      success: false,
      message: "User not logged in",
    };
  }
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  const result = await res.json();
  if (result.success) {
    revalidateTag("my-posts", "max");
  }

  if (result.success && result.data.IsPremium) {
    revalidateTag("premium-posts", "max");
  } else {
    revalidateTag("public-posts", "max");
  }

  return result;
};

export const getMyPosts = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) {
    // throw new Error("User not logged in");
    return {
      success: false,
      message: "User not logged in",
    };
  }
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts/my-posts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 24,
      tags: ["my-posts"],
    },
  });
  const result = await res.json();
  return result;
};
