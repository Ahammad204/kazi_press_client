"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IComment } from "@/lib/types";
import { useState } from "react";
import { createComment } from "../../_actions/createComment";
import { toast } from "sonner";

type CommentSectionProps = {
  postId: string;
  comments: IComment[];
  isLoggedIn: boolean;
};

export function CommentSection({
  postId,
  comments,
  isLoggedIn,
}: CommentSectionProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    const result = await createComment({ postId, content: content.trim() });

    if (result.success) {
      toast.success("Comment submitted! It will appear after moderation.");
      setContent("");
    } else {
      toast.error(result.message || "Failed to submit comment");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        Comments ({comments.length})
      </h3>

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 rounded-lg border p-4">
              <Avatar className="size-8">
                <AvatarFallback>
                  {comment.authorId.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoggedIn && (
        <div className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
          />
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Post Comment"}
          </Button>
        </div>
      )}

      {!isLoggedIn && (
        <p className="text-sm text-muted-foreground">
          Log in to leave a comment.
        </p>
      )}
    </div>
  );
}