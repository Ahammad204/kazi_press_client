import { notFound } from "next/navigation";
import { getNewsById } from "../../_actions/getNewsById";
import { IPost } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { CalendarIcon, EyeIcon, MessageSquareIcon } from "lucide-react";
import { CommentSection } from "../../_components/news/CommentSection";
import { getMe } from "@/service/getMe";

const NewsByIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const result = await getNewsById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const post: IPost & { comments?: { id: string; content: string; authorId: string; createdAt: string }[] } = result.data;
  const user = await getMe();
  const isLoggedIn = !!user?.id;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {post.IsPremium && (
            <Badge variant="default">Premium</Badge>
          )}
          {post.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            By {post.author?.name ?? "Unknown"}
          </span>
          <span className="flex items-center gap-1">
            <CalendarIcon className="size-3.5" />
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <EyeIcon className="size-3.5" />
            {post.views} views
          </span>
          <span className="flex items-center gap-1">
            <MessageSquareIcon className="size-3.5" />
            {post._count?.comments ?? post.comments?.length ?? 0}
          </span>
        </div>
      </div>

      {post.thumbnail && (
        <Image
          src={post.thumbnail}
          unoptimized
          alt={post.title}
          width={800}
          height={400}
          className="w-full rounded-lg object-cover"
        />
      )}

      <Card>
        <CardContent className="pt-6">
          <p className="whitespace-pre-line text-base leading-relaxed">
            {post.content}
          </p>
        </CardContent>
      </Card>

      <div className="border-t pt-8">
        <CommentSection
          postId={post.id}
          comments={post.comments ?? []}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
};

export default NewsByIdPage;