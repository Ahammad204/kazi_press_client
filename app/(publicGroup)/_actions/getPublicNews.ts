"use server";

import { cookies } from "next/headers";

export const getPublicNews = async ({
  query,
}: {
  query?: { [key: string]: string | string[] | undefined };
}) => {
  const params = new URLSearchParams();

  if (query && query.searchTerm) {
    params.set("searchTerm", query.searchTerm as string);
  }
  if (query && query.page) {
    params.set("page", query.page as string);
  }
  if (query && query.limit) {
    params.set("limit", query.limit as string);
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers.Cookie = `accessToken=${accessToken}`;
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/posts?${params.toString()}`,
    {
      headers,
      cache: "no-cache",
      next: {
        revalidate: 60 * 60 * 6,
        tags: ["public-posts"],
      },
    }
  );

  const result = await res.json();
  return result;
};