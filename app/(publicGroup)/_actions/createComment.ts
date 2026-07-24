"use server";

import { cookies } from "next/headers";

export const createComment = async ({
  postId,
  content,
}: {
  postId: string;
  content: string;
}) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}`,
    },
    body: JSON.stringify({ postId, content }),
  });

  const result = await res.json();
  return result;
};