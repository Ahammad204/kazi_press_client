"use server";
import { IPost } from "@/lib/types";
import { getNewAccessToken, isAccessTokenExist } from "@/service/refreshToken";
import { jwtUtils } from "@/utils/jwt";
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
  // const cookieStore = await cookies();
  // let accessToken = cookieStore.get("accessToken")?.value || null;
  // const refreshToken = cookieStore.get("refreshToken")?.value || null;

  // if (!accessToken && !refreshToken) {
  //   // throw new Error("User not logged in");
  //   return {
  //     success: false,
  //     message: "User not logged in",
  //   };
  // }

  // const decodedAccessToken = accessToken
  //   ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
  //   : null;

  // const decodedRefreshToken = refreshToken
  //   ? jwtUtils.verifyToken(
  //       refreshToken,
  //       process.env.JWT_REFRESH_SECRET as string,
  //     )
  //   : null;

  // if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
  //   //access token has expired but refresh token is valid, get new access token from backend
  //   const result = await getNewAccessToken();

  //   if (result.success) {
  //     const newAccessToken = result.data.accessToken;

  //     cookieStore.set("accessToken", newAccessToken, {
  //       httpOnly: true,
  //       maxAge: 60 * 60 * 24,
  //       sameSite: "lax",
  //     });

  //     accessToken = newAccessToken;
  //   }
  // }

  const accessToken = await isAccessTokenExist();

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
    revalidateTag("my-posts", {
      expire: 0,
    });
  }

  if (result.success && result.data.IsPremium) {
    revalidateTag("premium-posts", {
      expire: 0,
    });
  } else {
    revalidateTag("public-posts", {
      expire: 0,
    });
  }

  return result;
};
export const updatePost = async (
  postId: string,
  prevState: PostState,
  formData: FormData,
) => {
  const payload = {
    title: formData.get("title") ?? "",
    content: formData.get("content") ?? "",
    thumbnail: formData.get("thumbnail") ?? "",
    tags: (formData.get("tags") as string).split(", ") ?? "",
    IsPremium: formData.get("isPremium") === "on",
  };
  const accessToken = await isAccessTokenExist();

  // if (!accessToken && !refreshToken) {
  //   // throw new Error("User not logged in");
  //   return {
  //     success: false,
  //     message: "User not logged in",
  //   };
  // }

  // const decodedAccessToken = accessToken
  //   ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
  //   : null;

  // const decodedRefreshToken = refreshToken
  //   ? jwtUtils.verifyToken(
  //       refreshToken,
  //       process.env.JWT_REFRESH_SECRET as string,
  //     )
  //   : null;

  // if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
  //   //access token has expired but refresh token is valid, get new access token from backend
  //   const result = await getNewAccessToken();

  //   if (result.success) {
  //     const newAccessToken = result.data.accessToken;

  //     cookieStore.set("accessToken", newAccessToken, {
  //       httpOnly: true,
  //       maxAge: 60 * 60 * 24,
  //       sameSite: "lax",
  //     });

  //     accessToken = newAccessToken;
  //   }
  // }
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/posts/${postId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    },
  );
  const result = await res.json();
  if (result.success) {
    revalidateTag("my-posts", {
      expire: 0,
    });
  }

  if (result.success && result.data.IsPremium) {
    revalidateTag("premium-posts", {
      expire: 0,
    });
  } else {
    revalidateTag("public-posts", {
      expire: 0,
    });
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
