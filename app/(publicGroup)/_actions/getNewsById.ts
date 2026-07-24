"use server";

export const getNewsById = async (postId: string) => {
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/posts/${postId}`,
    {
      cache: "no-cache",
      next: {
        revalidate: 60 * 60 * 6,
        tags: ["post-detail"],
      },
    }
  );

  const result = await res.json();
  return result;
};